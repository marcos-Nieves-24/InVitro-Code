"use client";

import { useState } from "react";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";

interface RCopyButtonProps {
  mod: string;
  lesson: string;
  hasRScript: boolean;
}

export function RCopyButton({ mod, lesson, hasRScript }: RCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasRScript) return null;

  const handleCopy = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/rscript/${mod}/${lesson}`);
      if (!res.ok) throw new Error("Error al obtener el código R");
      const code = await res.text();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al copiar");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlideArrowButton
        variant="primary"
        primaryColor="#059669"
        size="sm"
        text={copied ? "Copiado" : "Copiar código R"}
        onClick={handleCopy}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
