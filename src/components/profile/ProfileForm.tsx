"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";

type GenderOption = "f" | "m" | "x" | null;

interface ProfileFormProps {
  username?: string | null;
  bio?: string | null;
  gender?: string | null;
  onSave: (data: { username: string; bio: string; gender: GenderOption }) => Promise<void>;
}

export function ProfileForm({ username, bio, gender, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    username: username || "",
    bio: bio || "",
    gender: (gender === "f" || gender === "m" || gender === "x" ? gender : null) as GenderOption,
  });
  const [acceptGenderX, setAcceptGenderX] = useState(false);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (formData.gender === "x" && !acceptGenderX) {
      setGenderError(
        "Para guardar 'No binaria' necesitás autorizar de forma expresa el tratamiento de este dato sensible (art. 6, Ley 1581). Esta autorización es facultativa y no condiciona el acceso al servicio. Si preferís no compartirlo, seleccioná 'Prefiero no decirlo'.",
      );
      return;
    }
    setGenderError(null);
    setSaving(true);
    setSaved(false);

    try {
      await onSave(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar el perfil";
      setGeneralError(message);
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

      <div>
        <label
          htmlFor="gender"
          className="mb-1 block text-sm font-medium text-ink"
        >
          Figura científica preferida
        </label>
        <p id="gender-help" className="mb-2 text-xs text-storm">
          Elige la variante que verás en el panel principal. Puedes cambiarla cuando quieras.
        </p>
        <select
          id="gender"
          aria-describedby="gender-help"
          value={formData.gender ?? ""}
          onChange={(e) => {
            const next = (e.target.value === "" ? null : e.target.value) as GenderOption;
            setFormData((prev) => ({ ...prev, gender: next }));
            if (next !== "x") {
              setGenderError(null);
              setAcceptGenderX(false);
            }
          }}
          className="w-full rounded-btn border border-surface-raised bg-surface-card px-4 py-2 text-sm text-ink transition-colors focus:border-mint focus:outline-none focus:ring-1 focus:ring-mint focus-visible:ring-2 focus-visible:ring-mint"
        >
          <option value="">Prefiero no decirlo</option>
          <option value="f">Femenina</option>
          <option value="m">Masculina</option>
          <option value="x">No binaria</option>
        </select>
      </div>

      {formData.gender === "x" && (
        <div className="rounded-btn border border-surface-raised bg-surface px-4 py-3">
          <div className="flex items-start gap-2">
            <input
              id="acceptGenderX"
              type="checkbox"
              checked={acceptGenderX}
              onChange={(e) => {
                setAcceptGenderX(e.target.checked);
                if (e.target.checked) setGenderError(null);
              }}
              className="mt-0.5 h-4 w-4 rounded border-surface-raised text-mint focus:ring-mint"
            />
            <label htmlFor="acceptGenderX" className="text-sm leading-snug text-ink">
              Autorizo de forma expresa el tratamiento de mi identidad de género no binaria (dato sensible, art. 6 Ley 1581).
              Esta autorización es facultativa y no condiciona el acceso al servicio.
            </label>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-storm">
            Si preferís no compartir esta información, podés mantener &apos;Prefiero no decirlo&apos; sin afectar tu cuenta.
          </p>
          {genderError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {genderError}
            </p>
          )}
        </div>
      )}

      {generalError && (
        <p role="alert" className="text-sm text-red-600">
          {generalError}
        </p>
      )}

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
