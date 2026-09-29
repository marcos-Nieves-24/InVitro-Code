"use client";

import { useEffect, useRef, useState } from "react";
import { BioreactorProgress } from "../../dashboard/BioreactorProgress/BioreactorProgress";

interface RiveBioreactorProps {
  /** 0-100 mapped from levelInfo.progressToNext */
  progress: number;
}

/**
 * Rive-powered lab canvas. Falls back to BioreactorProgress when Rive fails
 * or when /rive/bioreactor.riv is the placeholder text file (356 bytes).
 * dynamic import with ssr:false — must be wrapped in next/dynamic at parent level.
 */
export function RiveBioreactor({ progress }: RiveBioreactorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<unknown>(null);
  const [riveError, setRiveError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initRive() {
      try {
        // Detect placeholder file (text instead of real .riv binary).
        // The shipped placeholder contains "PLACEHOLDER" — Rive won't throw on it.
        try {
          const res = await fetch("/rive/bioreactor.riv");
          const text = await res.text();
          if (text.includes("PLACEHOLDER")) {
            if (!cancelled) setRiveError(true);
            return;
          }
        } catch {
          // ignore fetch failure — let Rive attempt and handle error below
        }

        const { Rive } = await import("@rive-app/canvas");
        if (cancelled || !canvasRef.current) return;

        const riveInstance = new Rive({
          canvas: canvasRef.current,
          src: "/rive/bioreactor.riv",
          stateMachines: "StateMachine",
          autoplay: true,
          onLoad: () => {
            // Map progress input (0-100) to state machine
            const inputs = (
              riveInstance as unknown as {
                stateMachineInputs: (name: string) => Array<{ name: string; value: number }>;
              }
            ).stateMachineInputs?.("StateMachine");
            if (inputs) {
              const progressInput = inputs.find((inp: { name: string }) => inp.name === "progress");
              if (progressInput) {
                progressInput.value = progress;
              }
            }
          },
          onLoadError: () => {
            if (!cancelled) setRiveError(true);
          },
        } as unknown as ConstructorParameters<typeof Rive>[0]);

        // Fallback event listener if onLoadError not triggered
        try {
          (riveInstance as unknown as { on?: (e: string, cb: () => void) => void }).on?.(
            "loadError",
            () => {
              if (!cancelled) setRiveError(true);
            },
          );
        } catch {
          // ignore
        }

        riveRef.current = riveInstance;
      } catch {
        if (!cancelled) setRiveError(true);
      }
    }

    initRive();

    return () => {
      cancelled = true;
      const rive = riveRef.current as { destroy?: () => void } | null;
      if (rive?.destroy) rive.destroy();
    };
  }, [progress]);

  // Update progress input when it changes
  useEffect(() => {
    const rive = riveRef.current as {
      stateMachineInputs?: (name: string) => Array<{ name: string; value: number }>;
    } | null;
    if (!rive?.stateMachineInputs) return;

    const inputs = rive.stateMachineInputs("StateMachine");
    const progressInput = inputs?.find((inp) => inp.name === "progress");
    if (progressInput) {
      progressInput.value = progress;
    }
  }, [progress]);

  if (riveError) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <BioreactorProgress
          exp={progress}
          expToNext={100}
          progressToNext={progress}
          level={1}
          rank="Iniciado"
          size="md"
          hideMeta
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="max-w-[280px] md:max-w-[340px] rounded-2xl bg-white/10"
      aria-label="Laboratorio animado"
      role="img"
    />
  );
}
