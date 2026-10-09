"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Layers } from "lucide-react";
import { normalizeSearchText } from "@/lib/search/normalize";

export interface CommandPaletteLesson {
  moduleSlug: string;
  slug: string;
  title: string;
}

export interface CommandPaletteModule {
  slug: string;
  name: string;
}

interface CommandPaletteProps {
  modules: CommandPaletteModule[];
  lessons: CommandPaletteLesson[];
}

interface FlatResult {
  key: string;
  href: string;
  title: string;
  moduleName: string;
  moduleSlug: string;
}

const MAX_RESULTS = 8;
const EMPTY_RESULTS = 5;

export function CommandPalette({ modules, lessons }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const moduleNameBySlug = useMemo(() => {
    const m = new Map<string, string>();
    for (const mod of modules) m.set(mod.slug, mod.name);
    return m;
  }, [modules]);

  const flat: FlatResult[] = useMemo(
    () =>
      lessons.map((l) => ({
        key: `${l.moduleSlug}/${l.slug}`,
        href: `/learn/${l.moduleSlug}/${l.slug}`,
        title: l.title,
        moduleName: moduleNameBySlug.get(l.moduleSlug) ?? l.moduleSlug,
        moduleSlug: l.moduleSlug,
      })),
    [lessons, moduleNameBySlug],
  );

  const results = useMemo(() => {
    const q = normalizeSearchText(query.trim());
    if (!q) return flat.slice(0, EMPTY_RESULTS);
    const filtered = flat.filter((r) => {
      const hayTitle = normalizeSearchText(r.title);
      const hayModule = normalizeSearchText(r.moduleName);
      return hayTitle.includes(q) || hayModule.includes(q);
    });
    return filtered.slice(0, MAX_RESULTS);
  }, [flat, query]);

  // Keep activeIndex in bounds when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  // Global hotkeys: Cmd+K / Ctrl+K and "/" (when not in input), Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!isInput && e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    // Custom event from InVitroShell search button
    const openListener = () => setOpen(true);
    window.addEventListener("keydown", handler);
    window.addEventListener("open-command-palette" as unknown as keyof WindowEventMap, openListener);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-command-palette" as unknown as keyof WindowEventMap, openListener);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // defer focus until modal mounted
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      // lock scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Arrow nav scroll into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) {
        setOpen(false);
        window.location.href = r.href;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!open) return null;

  const activeId = results[activeIndex] ? `cp-option-${activeIndex}` : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-[20vh]"
      onClick={() => setOpen(false)}
      aria-hidden={false}
    >
      <div
        className="glass-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar lecciones"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-surface-raised px-4">
          <Search className="h-5 w-5 shrink-0 text-storm" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="cp-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            placeholder="Buscar lecciones, módulos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent py-4 text-[15px] text-ink placeholder:text-storm focus:outline-none"
          />
          <kbd className="hidden rounded-md border border-surface-raised bg-surface px-1.5 py-0.5 text-[11px] font-medium text-storm md:inline">ESC</kbd>
        </div>

        {/* Results */}
        <div
          id="cp-listbox"
          ref={listRef}
          role="listbox"
          className="max-h-[320px] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink">Sin resultados</p>
              <p className="mt-1 text-xs text-storm">Probá con otro término o revisá la ortografía.</p>
            </div>
          ) : (
            <>
              {!query.trim() && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-storm">
                  Lecciones recientes
                </p>
              )}
              {results.map((r, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <Link
                    key={r.key}
                    href={r.href}
                    id={`cp-option-${idx}`}
                    role="option"
                    aria-selected={isActive}
                    data-index={idx}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      isActive ? "bg-mint/15 text-ink" : "hover:bg-surface-raised"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive ? "bg-mint text-ink" : "bg-surface-raised text-storm"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium leading-none">{r.title}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-storm">
                        <Layers className="h-3 w-3" />
                        {r.moduleName}
                      </span>
                    </span>
                    <span className="hidden text-xs text-storm md:inline">{r.moduleSlug}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-surface-raised bg-surface/50 px-4 py-2.5 text-xs text-storm backdrop-blur-sm">
          <span>
            <span className="font-medium">↑↓</span> navegar · <span className="font-medium">↵</span> abrir · <span className="font-medium">esc</span> cerrar
          </span>
          <span className="hidden items-center gap-1 md:flex">
            <kbd className="rounded border border-surface-raised bg-surface px-1 py-0.5 text-[10px]">⌘</kbd>
            <kbd className="rounded border border-surface-raised bg-surface px-1 py-0.5 text-[10px]">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
