"use client";

import { useState } from "react";
import { Save, Loader2, Bell, BellOff } from "lucide-react";

interface SettingsFormProps {
  theme?: string | null;
  notification_prefs?: { email?: boolean; streak?: boolean } | null;
  onSave: (data: {
    theme: string;
    notification_prefs: { email: boolean; streak: boolean };
  }) => Promise<void>;
}

export function SettingsForm({
  theme,
  notification_prefs,
  onSave,
}: SettingsFormProps) {
  const [formData, setFormData] = useState({
    theme: theme || "system",
    notification_prefs: {
      email: notification_prefs?.email ?? true,
      streak: notification_prefs?.streak ?? true,
    },
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-storm">
          Apariencia
        </h3>
        <div className="flex gap-4">
          {[
            { value: "light", label: "Claro" },
            { value: "dark", label: "Oscuro" },
            { value: "system", label: "Sistema" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-btn border px-4 py-2 text-sm transition-colors ${
                formData.theme === option.value
                  ? "border-mint bg-mint/10 text-ink"
                  : "border-surface-raised text-storm hover:bg-fog/20"
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={formData.theme === option.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, theme: e.target.value }))
                }
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-storm">
          Notificaciones
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.notification_prefs.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notification_prefs: {
                    ...prev.notification_prefs,
                    email: e.target.checked,
                  },
                }))
              }
              className="h-4 w-4 rounded accent-mint"
            />
            <span className="text-sm text-ink">Notificaciones por email</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.notification_prefs.streak}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notification_prefs: {
                    ...prev.notification_prefs,
                    streak: e.target.checked,
                  },
                }))
              }
              className="h-4 w-4 rounded accent-mint"
            />
            <span className="text-sm text-ink">
              Recordatorios de racha
            </span>
          </label>
        </div>
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
        {saved ? "Guardado" : "Guardar preferencias"}
      </button>
    </form>
  );
}
