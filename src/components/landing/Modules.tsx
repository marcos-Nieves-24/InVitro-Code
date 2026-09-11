"use client";

import { Code, Brain, FlaskConical, BarChart3, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const modules = [
  {
    icon: Brain,
    slug: "MOD-01",
    title: "Introduccion a la IA",
    lessons: 4,
    description:
      "Fundamentos de inteligencia artificial aplicados a biotecnologia.",
  },
  {
    icon: Code,
    slug: "MOD-02",
    title: "Python para Biotecnologia",
    lessons: 17,
    description:
      "Programacion en Python aplicada al analisis de datos biologicos.",
  },
  {
    icon: BarChart3,
    slug: "MOD-03",
    title: "Estadistica y Probabilidad",
    lessons: 10,
    description:
      "Fundamentos estadisticos para el analisis de datos en investigacion biomedica.",
  },
  {
    icon: FlaskConical,
    slug: "MOD-04",
    title: "Machine Learning",
    lessons: 10,
    description:
      "Algoritmos de aprendizaje automatico para aplicaciones biotecnologicas.",
  },
];

export function Modules() {
  return (
    <section id="modulos" className="bg-surface-card px-6 py-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="eyebrow text-storm">Contenido</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink mt-3 mb-4 md:text-4xl">
              Expediciones del curso
            </h2>
            <p className="text-lg leading-relaxed text-slate max-w-2xl mx-auto">
              Cada modulo es una expedicion guiada que combina teoria, practica
              en terminal y laboratorios interactivos.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Reveal key={mod.slug} delay={i * 150}>
                <div className="card-hover flex h-full flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface">
                    <Icon size={24} className="text-mint" />
                  </div>
                  <p className="eyebrow text-storm mb-2">{mod.slug}</p>
                  <h3 className="font-display text-lg font-bold text-ink mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate mb-4 flex-1">
                    {mod.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-surface-raised pt-4">
                    <span className="font-mono text-xs text-storm">
                      {mod.lessons} lecciones
                    </span>
                    <a
                      href="/sign-in"
                      className="flex items-center gap-1 text-sm font-medium text-ink transition-all hover:gap-2"
                    >
                      Explorar
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
