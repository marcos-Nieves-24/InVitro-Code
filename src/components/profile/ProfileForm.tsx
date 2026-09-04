"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  username?: string | null;
  bio?: string | null;
  onSave: (data: { username: string; bio: string }) => Promise<void>;
}

export function ProfileForm({ username, bio, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    username: username || "",
    bio: bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await onSave(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Nombre de usuario
        </label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
          className="w-full rounded-btn border border-surface-raised bg-surface-card px-4 py-2 text-sm text-ink placeholder-storm transition-colors focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
          placeholder="Tu nombre de usuario"
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Biografía
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
          rows={3}
          className="w-full rounded-btn border border-surface-raised bg-surface-card px-4 py-2 text-sm text-ink placeholder-storm transition-colors focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint"
          placeholder="Cuéntanos sobre ti..."
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-btn bg-mint px-4 py-2 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-fog disabled:pointer-events-none disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saved ? "Guardado" : "Guardar cambios"}
      </button>
    </form>
  );
}
