"use client";

import { useState, useEffect, useRef } from "react";

interface OutputPanelProps {
  output: string[];
  validationResult: "" | "valid" | "invalid";
  isRunning: boolean;
  onClear: () => void;
  exercise?: {
    testCases: Array<{ expectedOutput: string; note: string }>;
  };
}

export default function OutputPanel({
  output,
  validationResult,
  isRunning,
  onClear,
  exercise
}: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  const getOutputColor = (line: string, index: number) => {
    if (line.startsWith("Error:")) {
      return "text-red-600 bg-red-50 border-l-4 border-red-500 pl-3 py-2 rounded";
    }
    if (line.includes("Ploteado:")) {
      return "text-blue-600 bg-blue-50 border-l-4 border-blue-500 pl-3 py-2 rounded";
    }
    if (line.includes("Plotly:")) {
      return "text-purple-600 bg-purple-50 border-l-4 border-purple-500 pl-3 py-2 rounded";
    }
    if (line.includes("Output:")) {
      return "text-green-800 font-mono bg-green-50 pl-3 py-2 rounded";
    }
    return "text-gray-800 font-mono pl-3 py-2";
  };
  
  const formatOutput = (line: string, index: number) => {
    // Highlight important patterns
    if (line.trim() === "") return <div className="h-2"></div>;
    
    // Check if this line is a validation result
    if (index === output.length - 1 && validationResult === "valid") {
      return (
        <div key={index} className="flex items-center space-x-2 my-2">
          <span className="text-green-600 text-xl">✓</span>
          <span className="text-green-800 font-semibold bg-green-100 px-3 py-1 rounded-full">
            Correcto - Todos los tests pasaron!
          </span>
        </div>
      );
    }
    
    if (index === output.length - 1 && validationResult === "invalid") {
      return (
        <div key={index} className="flex items-center space-x-2 my-2">
          <span className="text-red-600 text-xl">✗</span>
          <span className="text-red-800 font-semibold bg-red-100 px-3 py-1 rounded-full">
            No coincide con el test - Intenta de nuevo
          </span>
        </div>
      );
    }
    
    return (
      <div key={index} className={getOutputColor(line, index)}>
        {line}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Consola de Salida</h3>
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </div>
        
        {exercise && (
          <div className="mt-2 text-sm text-gray-600">
            {exercise.testCases.length} test case{exercise.testCases.length !== 1 ? "s" : ""} | 
            Status: <span className={`font-medium ${validationResult === "valid" ? "text-green-600" : validationResult === "invalid" ? "text-red-600" : "text-gray-600"}`}>
              {validationResult === "valid" ? "✓ Validación Completada" :
               validationResult === "invalid" ? "✗ No Completado" :
               "⏳ En Espera"}
            </span>
          </div>
        )}
        
        {isRunning && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600">Ejecutando...</span>
          </div>
        )}
      </div>
      
      {/* Output Content */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm bg-gray-900 text-gray-100"
        style={{ maxHeight: "400px" }}
      >
        {output.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            La salida aparecerá aquí cuando ejecutes tu código.<br/>
            <span className="text-xs">Usa "Ejecutar" para probar tu código</span>
          </div>
        ) : (
          output.map((line, index) => formatOutput(line, index))
        )}
      </div>
    </div>
  );
}
