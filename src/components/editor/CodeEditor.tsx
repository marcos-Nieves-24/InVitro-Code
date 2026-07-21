"use client";

import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  language?: string;
  defaultValue?: string;
  onRun?: (code: string) => void;
  isRunning?: boolean;
  isWorkerReady?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  height = "300px",
  language = "python",
  defaultValue = "# Escribe tu código Python aquí...\nprint('Hola Mundo!')",
  onRun,
  isRunning = false,
  isWorkerReady = false,
}: CodeEditorProps) {
  const handleEditorMount: OnMount = (editor, monaco) => {
    // Register Shift+Enter to run code
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: () => {
        if (onRun) onRun(editor.getValue());
      },
    });
  };

  const handleChange = (val: string | undefined) => {
    if (onChange && val !== undefined) {
      onChange(val);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Editor ({language})
        </span>
        <button
          onClick={() => onRun?.(value ?? defaultValue)}
          disabled={!isWorkerReady || isRunning}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            !isWorkerReady || isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isRunning ? "Ejecutando..." : "▶ Ejecutar"}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Editor
          height={height}
          language={language}
          theme="vs-dark"
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
}
