"use client";

import { Users, UserX, Activity } from "lucide-react";

interface AdminDashboardProps {
  totalUsers: number;
  bannedUsers: number;
  activeWeek: number;
}

export function AdminDashboard({
  totalUsers,
  bannedUsers,
  activeWeek,
}: AdminDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/20 text-mint">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-storm">Total Usuarios</p>
            <p className="font-display text-2xl font-bold text-ink">
              {totalUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <UserX className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-storm">Baneados</p>
            <p className="font-display text-2xl font-bold text-ink">
              {bannedUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-storm">Activos (7 días)</p>
            <p className="font-display text-2xl font-bold text-ink">
              {activeWeek}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
