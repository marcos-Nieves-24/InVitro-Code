"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Mision", href: "#mision" },
  { label: "Modulos", href: "#modulos" },
  { label: "Equipo", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 header-bg ${
        scrolled
          ? "bg-surface-card/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="InVitro-Code"
            className="h-8 w-8"
          />
          <span className="font-display text-lg font-bold text-ink">
            InVitro-Code
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sign-up"
            className="rounded-[10px] bg-mint px-5 py-2.5 text-sm font-medium text-ink transition-all hover:shadow-glow"
          >
            Comenzar
          </a>
        </nav>

        <button
          className="text-ink md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-surface-raised bg-surface-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="rounded-[10px] bg-mint px-5 py-2.5 text-center text-sm font-medium text-ink"
            >
              Comenzar
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
