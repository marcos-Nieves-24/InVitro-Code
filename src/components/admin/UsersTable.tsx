"use client";

import { useState } from "react";
import { Shield, ShieldOff, UserX, UserCheck, Search, Flame, Gem, BookOpen } from "lucide-react";

interface User {
  id: string;
  email?: string | null;
  username?: string | null;
  role?: string | null;
  is_banned?: boolean | null;
  created_at?: string | null;
  total_xp?: number;
  current_streak?: number;
  longest_streak?: number;
  lessons_completed?: number;
  last_active_date?: string | null;
}

interface UsersTableProps {
  users: User[];
  onBanToggle: (userId: string, isBanned: boolean) => void;
  onRoleChange: (userId: string, role: string) => void;
}

export function UsersTable({ users, onBanToggle, onRoleChange }: UsersTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-hidden rounded-card border border-surface-raised bg-surface-card shadow-sm">
      <div className="border-b border-surface-raised bg-fog/10 px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-storm" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-btn border border-surface-raised bg-surface-card py-2 pl-9 pr-3 text-sm text-ink placeholder-storm transition-colors focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-raised bg-fog/20">
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Usuario
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                XP
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Racha
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Lecciones
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Estado
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Última vez
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-surface-raised last:border-0 hover:bg-fog/10"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {user.username || "Sin nombre"}
                </td>
                <td className="px-4 py-3 text-storm">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    <Gem className="h-3 w-3 text-mint" />
                    {(user.total_xp ?? 0).toLocaleString("es")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {user.current_streak ?? 0} días
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    <BookOpen className="h-3 w-3 text-blue-500" />
                    {user.lessons_completed ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      user.is_banned
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.is_banned ? "Baneado" : "Activo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-storm">
                  {user.last_active_date
                    ? new Date(user.last_active_date).toLocaleDateString("es")
                    : "Nunca"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onBanToggle(user.id, !user.is_banned)}
                      className="rounded-btn p-1.5 text-storm transition-colors hover:bg-fog/20 hover:text-ink"
                      title={user.is_banned ? "Desbanear" : "Banear"}
                    >
                      {user.is_banned ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <UserX className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        onRoleChange(
                          user.id,
                          user.role === "admin" ? "user" : "admin"
                        )
                      }
                      className="rounded-btn p-1.5 text-storm transition-colors hover:bg-fog/20 hover:text-ink"
                      title={user.role === "admin" ? "Quitar admin" : "Hacer admin"}
                    >
                      {user.role === "admin" ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-storm">
          No se encontraron usuarios
        </div>
      )}
    </div>
  );
}
