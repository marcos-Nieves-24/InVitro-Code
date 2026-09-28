"use client";

import { Reveal } from "@/components/Reveal";
import { OrbitalModules } from "./OrbitalModules";

export function Modules() {
  return (
    <section id="modulos" className="bg-[#111439] px-6 py-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="eyebrow text-white/60">Contenido</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-3 mb-4 md:text-4xl">
              Expediciones del curso
            </h2>
            <p className="text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
              Cada modulo es una expedicion guiada que combina teoria, practica
              en terminal y laboratorios interactivos.
            </p>
          </div>
        </Reveal>
        <OrbitalModules />
      </div>
    </section>
  );
}
