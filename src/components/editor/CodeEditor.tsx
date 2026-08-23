"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { ConsoleFrame } from "./ConsoleFrame";

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  language?: string;
  defaultValue?: string;
  onRun?: (code: string) => void;
  isRunning?: boolean;
  isWorkerReady?: boolean;
  title?: string;
  status?: string;
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
  title = "main.py",
  status,
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

    monaco.editor.defineTheme("console-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a0a",
        "editorGutter.background": "#0a0a0a",
        "editor.lineHighlightBackground": "#111111",
        "editorLineNumber.foreground": "#3b3b3b",
        "editorLineNumber.activeForeground": "#888888",
        "editor.selectionBackground": "#264f78",
        "editorCursor.foreground": "#3fb950",
      },
    });
  };

  const handleChange = (val: string | undefined) => {
    if (onChange && val !== undefined) {
      onChange(val);
    }
  };

  return (
    <ConsoleFrame
      title={title}
      maximizable
      storageKey="console-editor"
      action={
        <>
          {status ? (
            <span className="hidden font-mono text-[11px] text-[#888] sm:inline">
              {status}
            </span>
          ) : null}
          <button
            onClick={() => onRun?.(value ?? defaultValue)}
            disabled={!isWorkerReady || isRunning}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[12px] font-medium transition-all ${
              !isWorkerReady || isRunning
                ? "cursor-not-allowed bg-[#1d1d1d] text-[#555]"
                : "bg-[#27c93f] text-[#0a0a0a] hover:bg-[#3fb950] active:scale-95"
            }`}
          >
            {isRunning ? "Ejecutando..." : "Ejecutar"}
          </button>
        </>
      }
    >
      <div className="overflow-hidden rounded-lg border border-[#222]">
        <Editor
          height={height}
          language={language}
          theme="console-dark"
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
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </ConsoleFrame>
  );
}