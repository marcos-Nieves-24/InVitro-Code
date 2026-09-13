"use client";

import { Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section id="contacto" className="bg-surface-card px-6 py-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="eyebrow text-storm">Hablemos</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink mt-3 mb-4 md:text-4xl">
              Contacto
            </h2>
            <p className="text-lg leading-relaxed text-slate max-w-2xl mx-auto">
              Tienes preguntas, ideas o quieres colaborar? Escribenos.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-surface-raised bg-surface-card p-8 shadow-md">
            <div className="flex flex-col items-center gap-6">
              <a
                href="mailto:invitro.code@gmail.com"
                className="group flex items-center gap-3 text-ink transition-colors hover:text-mint"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface transition-all group-hover:shadow-glow">
                  <Mail size={24} className="text-mint" />
                </div>
                <span className="font-display text-xl font-bold">
                  invitro.code@gmail.com
                </span>
              </a>

              <div className="flex items-center gap-3 text-slate">
                <MapPin size={20} className="text-fog" />
                <span>Medellin, Colombia</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
