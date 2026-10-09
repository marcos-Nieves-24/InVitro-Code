"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENT_POLICY_VERSION } from "@/domain/consent";

function getConsentText(version: string): string {
  return `Acepto la Política de Privacidad y autorizo el tratamiento de mis datos personales para las finalidades descritas. Entiendo que algunos datos podrán ser procesados por proveedores tecnológicos ubicados en Estados Unidos (Clerk, Supabase y Vercel), conforme a la normativa vigente. Asimismo, confirmo que he leído y acepto el Aviso Legal (${version}). Puedes retirar tu consentimiento en cualquier momento escribiendo a invitro.code@gmail.com. Consulta tus derechos y más información en nuestra Política de Privacidad. Fuente: Ley 1581 de 2012, arts. 9 y 26 y Ley 527 de 1999 (mensaje de datos conservable).`;
}

async function sha256(text: string): Promise<string> {
  try {
    if (
      typeof crypto !== "undefined" &&
      crypto.subtle &&
      typeof crypto.subtle.digest === "function"
    ) {
      const data = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // fall through
  }
  if (typeof btoa !== "undefined") {
    try {
      return btoa(text).slice(0, 64);
    } catch {
      // ignore
    }
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

type Props = {
  pendingSince?: string | null;
};

export function ConsentPendingCard({ pendingSince }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleComplete = async () => {
    if (!checked) {
      setError("Debés marcar la casilla para autorizar F-01 y transfer:EEUU.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const texto = getConsentText(CURRENT_POLICY_VERSION);
      const acceptedTextHash = await sha256(texto);
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyVersion: CURRENT_POLICY_VERSION,
          acceptedTextHash,
          purposes: ["F-01", "transfer:EEUU"],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      setSuccess(true);
      // Ventanilla única: status verified, banner desaparece
      router.refresh();
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar la autorización";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="alert"
      className="rounded-card border border-amber-200 bg-amber-50 p-6 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-amber-900">Autorización pendiente — Ley 1581</h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900">
        Tu cuenta está en estado <span className="font-semibold">pendiente</span>. Para activar tu progreso y
        laboratorios necesitás completar la autorización de tratamiento de datos (arts. 9 y 26, Ley 1581 de 2012) y la
        transferencia a proveedores en Estados Unidos (Clerk, Supabase, Vercel). Sin esta ventanilla única tus datos
        no serán procesados más allá del período de gracia de 24&nbsp;h.
      </p>
      {pendingSince && (
        <p className="mt-1 text-xs text-amber-800">
          Pendiente desde: {new Date(pendingSince).toLocaleString("es-AR")}
        </p>
      )}
      <div className="mt-4 flex items-start gap-2 rounded-btn border border-amber-200 bg-white px-3 py-3">
        <input
          id="consent-pending-check"
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            if (e.target.checked) setError(null);
          }}
          className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="consent-pending-check" className="text-sm leading-snug text-amber-900">
          Autorizo el tratamiento para la finalidad F-01 (registro y autenticación) y la transferencia a EE.&nbsp;UU.
          conforme a la Política de Privacidad ({CURRENT_POLICY_VERSION}). Entiendo que puedo retirar mi consentimiento
          escribiendo a invitro.code@gmail.com.
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-3 text-sm font-medium text-green-700">
          ¡Autorización completada! Actualizando…
        </p>
      )}
      <button
        type="button"
        onClick={handleComplete}
        disabled={loading || success}
        className="mt-4 inline-flex items-center justify-center rounded-btn bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Completando…" : success ? "Completada" : "Completar autorización"}
      </button>
    </div>
  );
}
