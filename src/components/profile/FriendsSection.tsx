"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Check, X } from "lucide-react";

type Friend = {
  friendId: string;
  created_at: string;
  profile?: { id: string; username: string | null; avatar_url: string | null } | null;
};

type PendingRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
};

export function FriendsSection() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/friend-request?type=friends");
      const data = await res.json();
      if (res.ok) setFriends(data.friends ?? []);
    } catch {}
    try {
      const res2 = await fetch("/api/friend-request?type=pending_received");
      const data2 = await res2.json();
      if (res2.ok) setPending(data2.list ?? []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (requestId: string) => {
    const res = await fetch("/api/friend-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action: "accept" }),
    });
    if (res.ok) fetchData();
    else alert("Error al aceptar");
  };

  const handleDecline = async (requestId: string) => {
    const res = await fetch("/api/friend-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action: "decline" }),
    });
    if (res.ok) fetchData();
    else alert("Error al rechazar");
  };

  if (loading) {
    return (
      <div className="rounded-card border border-surface-raised bg-surface-card p-8 shadow-md">
        <p className="text-sm text-storm">Cargando amigos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-8 shadow-md">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-mint" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Amigos</h3>
        <span className="rounded-full bg-fog px-2 py-0.5 text-xs font-bold text-ink">{friends.length}</span>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-storm">
            <UserPlus className="h-4 w-4" /> Invitaciones pendientes
          </h4>
          <div className="space-y-2">
            {pending.map((req) => (
              <div key={req.id} className="flex items-center gap-3 rounded-btn bg-surface px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">Invitación de {req.sender_id.slice(0, 8)}...</p>
                  <p className="text-xs text-storm">{new Date(req.created_at).toLocaleDateString("es-AR")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAccept(req.id)}
                  className="rounded-btn bg-mint p-2 text-ink hover:bg-fog"
                  aria-label="Aceptar"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDecline(req.id)}
                  className="rounded-btn border border-surface-raised p-2 text-storm hover:bg-surface-card"
                  aria-label="Rechazar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {friends.length === 0 ? (
        <p className="py-4 text-center text-sm text-storm">
          Aún no tienes amigos. ¡Envía una invitación con <span className="font-bold text-mint">Conectar</span>!
        </p>
      ) : (
        <div className="space-y-2">
          {friends.map((f) => {
            const initials = (f.profile?.username ?? f.friendId).slice(0, 2).toUpperCase();
            return (
              <div key={f.friendId} className="flex items-center gap-3 rounded-btn bg-surface px-4 py-3">
                {f.profile?.avatar_url ? (
                  <img src={f.profile.avatar_url} alt={f.profile.username ?? "Amigo"} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fog text-xs font-bold text-ink">
                    {initials}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{f.profile?.username ?? f.friendId.slice(0, 8)}</p>
                  <p className="text-xs text-storm">Amigos desde {new Date(f.created_at).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
