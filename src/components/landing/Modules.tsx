"use client";

import { Reveal } from "@/components/Reveal";
import { OrbitalModules } from "./OrbitalModules";

export function Modules() {
  return (
    <section
      id="modulos"
      className="relative overflow-hidden bg-[#F8FBFA] px-6 py-24"
    >
      {/* Ambient decoration — borders only, pointer-events none */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full bg-[#DDF5EF]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-32 h-[480px] w-[480px] rounded-full bg-[#DDF5EF]/45 blur-3xl"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-[12%] h-[220px] w-[220px] opacity-50"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          d="M 20 180 A 140 140 0 0 1 180 20"
          stroke="#DDF5EF"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-[8%] h-[200px] w-[200px] opacity-50"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M 180 20 A 130 130 0 0 0 20 180"
          stroke="#DDF5EF"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto max-w-[1360px] px-2 md:px-4">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.22em] text-[#0AAE9A] uppercase">
              Contenido
            </p>
            <h2 className="font-display mt-3 mb-4 text-[32px] font-bold tracking-tight text-[#101B3D] md:text-[48px]">
              Expediciones del curso
            </h2>
            <p className="mx-auto max-w-[680px] text-[17px] leading-relaxed text-[#668094]">
              Cada módulo es una expedición guiada que combina teoría, práctica
              en terminal y laboratorios interactivos.
            </p>
          </div>
        </Reveal>
        <OrbitalModules />
      </div>
    </section>
  );
}
