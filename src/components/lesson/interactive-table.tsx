"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

// ---- Column-based API (used by ML lessons) ----
interface ColumnDef {
  key: string;
  label: string;
}

interface ColumnBasedRows {
  [key: string]: string;
}

// ---- Array-based API (used by estadística and original lessons) ----
interface ArrayBasedHeaders extends Array<string> {}

type InteractiveTableProps =
  | {
      // Column-based API
      columns: ColumnDef[];
      rows: ColumnBasedRows[];
      caption?: string;
      searchable?: boolean;
      headers?: never;
    }
  | {
      // Array-based API
      headers: string[];
      rows: string[][];
      caption?: string;
      searchable?: boolean;
      columns?: never;
    };

export function InteractiveTable(props: InteractiveTableProps) {
  const { caption, searchable = false } = props;
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  // Normalize both APIs into headers: string[] and rows: string[][]
  const { headers, rows } = useMemo(() => {
    if ("columns" in props && props.columns) {
      const cols = props.columns;
      return {
        headers: cols.map((c) => c.label),
        rows: (props.rows as ColumnBasedRows[]).map((row) =>
          cols.map((c) => row[c.key] ?? ""),
        ),
      };
    }
    return {
      headers: (props as { headers: string[] }).headers ?? [],
      rows: (props as { rows: string[][] }).rows ?? [],
    };
  }, [props]);

  const processedRows = useMemo(() => {
    let filtered = rows;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = rows.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(q)),
      );
    }

    if (sortColumn !== null) {
      return [...filtered].sort((a, b) => {
        const valA = stripMarkdown(a[sortColumn] ?? "").toLowerCase();
        const valB = stripMarkdown(b[sortColumn] ?? "").toLowerCase();
        const cmp = valA.localeCompare(valB, "es", { numeric: true });
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  }, [rows, sortColumn, sortDirection, search]);

  const handleSort = (colIdx: number) => {
    if (sortColumn === colIdx) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(colIdx);
      setSortDirection("asc");
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      {searchable && (
        <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar en la tabla"
              autoComplete="off"
              placeholder="Buscar en la tabla…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {headers.map((header, i) => (
                <th
                  key={i}
                  role="columnheader"
                  tabIndex={0}
                  onClick={() => handleSort(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort(i);
                    }
                  }}
                  aria-sort={sortColumn === i ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                  className="group cursor-pointer select-none px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {header}
                    {sortColumn === i ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3 w-3 text-blue-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-blue-500" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-10 text-center font-mono text-xs text-gray-400"
                >
                  {search ? "Sin resultados para esa búsqueda" : "Tabla vacía"}
                </td>
              </tr>
            ) : (
              processedRows.map((row, i) => (
                <tr
                  key={i}
                  className={`transition-colors hover:bg-blue-50/40 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-gray-700">
                      <CellRenderer value={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {caption && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2 font-mono text-[11px] text-gray-400">
          {caption}
        </div>
      )}
    </div>
  );
}

function CellRenderer({ value }: { value: string }) {
  const parts = value.split(/(`[^`]+`)/g);
  if (parts.length === 1) {
    return <>{value}</>;
  }
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          const code = part.slice(1, -1);
          return (
            <code
              key={i}
              className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[12px] text-gray-800"
            >
              {code}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s+/, "")
    .trim();
}
