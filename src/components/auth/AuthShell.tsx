import type { ReactNode } from "react";
import { AuthBrandAnimation } from "./AuthBrandAnimation";

type AuthShellProps = {
  children: ReactNode;
  /** Controls eyebrow text: "Acceso" for sign-in, "Crear cuenta" for sign-up */
  variant: "sign-in" | "sign-up";
};

export function AuthShell({ children, variant }: AuthShellProps) {
  const eyebrow = variant === "sign-in" ? "Acceso" : "Crear cuenta";

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel — left side */}
      <div className="auth-gradient-bg relative flex min-h-[40vh] items-center justify-center overflow-hidden p-8 md:min-h-0">
        {/* Animated SVG background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AuthBrandAnimation className="h-full w-full max-w-[500px] opacity-80" />
        </div>

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Logo + tagline */}
        <div className="relative z-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-negativo.svg"
            alt="InVitro-Code"
            className="mx-auto mb-4 w-16 drop-shadow-[0_0_15px_rgba(0,178,178,0.6)] md:w-20"
          />
          <h1 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-lg">
            InVitro-Code
          </h1>
          <p className="mt-2 max-w-xs text-lg text-white/80">
            Aprende Biotecnología e IA con código
          </p>
        </div>
      </div>

      {/* Form panel — right side */}
      <div className="flex items-center justify-center bg-surface-card p-8 py-10">
        <div className="w-full max-w-md">
          <p className="eyebrow mb-4 text-center">{eyebrow}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
