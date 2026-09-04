"use client";

import { Shield, ShieldOff, UserX, UserCheck } from "lucide-react";

interface User {
  id: string;
  email?: string | null;
  username?: string | null;
  role?: string | null;
  is_banned?: boolean | null;
  created_at?: string | null;
}

interface UsersTableProps {
  users: User[];
  onBanToggle: (userId: string, isBanned: boolean) => void;
  onRoleChange: (userId: string, role: string) => void;
}

export function UsersTable({ users, onBanToggle, onRoleChange }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-surface-raised bg-surface-card shadow-sm">
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
                Rol
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Estado
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Registro
              </th>
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-storm">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-surface-raised last:border-0 hover:bg-fog/10"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {user.username || "Sin nombre"}
                </td>
                <td className="px-4 py-3 text-storm">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-mint/20 text-mint"
                        : "bg-fog/20 text-storm"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="h-3 w-3" />
                    ) : null}
                    {user.role || "user"}
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
                <td className="px-4 py-3 text-storm">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("es")
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onBanToggle(user.id, !user.is_banned)
                      }
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
                      title={
                        user.role === "admin"
                          ? "Quitar admin"
                          : "Hacer admin"
                      }
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
    </div>
  );
}
