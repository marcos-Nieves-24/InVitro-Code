"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface RiveBioreactorProps {
  /** 0-100 mapped from levelInfo.progressToNext */
  progress: number;
}

/**
 * Rive-powered bioreactor canvas. Falls back to static SVG if Rive fails.
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
        const { Rive } = await import("@rive-app/canvas");
        if (cancelled || !canvasRef.current) return;

        const riveInstance = new Rive({
          canvas: canvasRef.current,
          src: "/rive/bioreactor.riv",
          stateMachines: "StateMachine",
          autoplay: true,
          onLoad: () => {
            // Map progress input (0-100) to state machine
            const inputs = riveInstance.stateMachineInputs?.("StateMachine");
            if (inputs) {
              const progressInput = inputs.find(
                (inp: { name: string }) => inp.name === "progress",
              );
              if (progressInput) {
                progressInput.value = progress;
              }
            }
          },
        });

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
      <div className="flex items-center justify-center">
        <Image
          src="/labs/modules/ia.svg"
          alt="Bioreactor"
          width={280}
          height={280}
          className="opacity-80"
          priority
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="max-w-[280px] md:max-w-[340px]"
      aria-label="Bioreactor animado"
      role="img"
    />
  );
}
