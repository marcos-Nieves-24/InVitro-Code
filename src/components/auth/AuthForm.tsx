"use client";

import { useState, type FormEvent } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import { type AuthStatus } from "./LiquidWave";
import { CURRENT_POLICY_VERSION } from "@/domain/consent";

export type AuthMode = "signin" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onStatusChange?: (status: AuthStatus) => void;
}

function getConsentText(version: string): string {
  return `Acepto la Política de Privacidad (${version}), finalidades F-01 a F-07 y transferencia internacional a EE.UU. (Clerk/Supabase/Vercel) art.26`;
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
    // fall through to fallback
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

export function AuthForm({ mode, onStatusChange }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [acceptBase, setAcceptBase] = useState(false);
  const [acceptGenderX, setAcceptGenderX] = useState(false);

  const router = useRouter();
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const isLoaded =
    (signInFetchStatus !== "idle" || !!signIn) &&
    (signUpFetchStatus !== "idle" || !!signUp);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded || isSubmitting) return;

    if (mode === "signup" && !acceptBase) {
      setError("Debés aceptar la Política para crear cuenta");
      onStatusChange?.("error");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    onStatusChange?.("loading");

    try {
      // Always attempt signIn first using Core 3 API
      if (!signIn) {
        throw new Error("Sign-in not initialized");
      }

      const { error: signInError } = await signIn.password({
        emailAddress: email,
        password,
      });

      // Sign-in succeeded — finalize the session
      if (!signInError && signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            window.location.href = url;
          },
        });
        if (finalizeError) {
          setError(finalizeError.message || "Error al iniciar sesión.");
          onStatusChange?.("error");
        }
        return;
      }

      // Check if the error indicates user doesn't exist
      if (
        signInError &&
        isClerkAPIResponseError(signInError) &&
        signInError.errors[0]?.code === "form_identifier_not_found"
      ) {
        // Guard: block sign-up creation if consent not given
        if (mode === "signup" && !acceptBase) {
          setError("Debés aceptar la Política para crear cuenta");
          onStatusChange?.("error");
          return;
        }

        // User doesn't exist — attempt sign-up using Core 3 API
        if (!signUp) {
          throw new Error("Sign-up not initialized");
        }

        const { error: signUpError } = await signUp.password({
          emailAddress: email,
          password,
        });

        if (signUpError) {
          onStatusChange?.("error");
          setError(
            signUpError.message ||
              "No se pudo crear la cuenta. Intenta de nuevo.",
          );
          return;
        }

        // Best-effort consent record — do not abort registration on failure
        try {
          const texto = getConsentText(CURRENT_POLICY_VERSION);
          const acceptedTextHash = await sha256(texto);
          await fetch("/api/consent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              policyVersion: CURRENT_POLICY_VERSION,
              acceptedTextHash,
              purposes: ["F-01", "transfer:EEUU"],
            }),
          });
        } catch {
          // best-effort: pending will be handled by webhook
        }

        // Sign-up complete — finalize the session
        if (signUp.status === "complete") {
          const { error: finalizeError } = await signUp.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                console.log("Session task:", session.currentTask);
                return;
              }
              const url = decorateUrl("/");
              window.location.href = url;
            },
          });
          if (finalizeError) {
            setError(finalizeError.message || "Error al crear la cuenta.");
            onStatusChange?.("error");
          }
          return;
        }

        // Email verification required — send code first
        if (signUp.status === "missing_requirements") {
          await signUp.verifications.sendEmailCode();
          setShowVerification(true);
          onStatusChange?.("idle");
          return;
        }

        onStatusChange?.("error");
        setError("No se pudo completar el registro. Intenta de nuevo.");
        return;
      }

      // Other sign-in error (wrong password, etc.)
      onStatusChange?.("error");
      setError(
        signInError?.message ||
          "Ocurrió un error. Intenta de nuevo.",
      );
    } catch (err: unknown) {
      onStatusChange?.("error");

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      } else if (err instanceof Error) {
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!signUp || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    onStatusChange?.("loading");

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (verifyError) {
        onStatusChange?.("error");
        setError(
          verifyError.message ||
            "Código inválido. Intenta de nuevo.",
        );
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            window.location.href = url;
          },
        });
        if (finalizeError) {
          setError(finalizeError.message || "Error al verificar.");
          onStatusChange?.("error");
        }
      }
    } catch (err: unknown) {
      onStatusChange?.("error");

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      } else if (err instanceof Error) {
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={showVerification ? handleVerification : handleSubmit}
      className="space-y-6"
    >
      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#111439] mb-2"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          autoComplete="email"
          disabled={isSubmitting || showVerification}
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#111439] placeholder-[#5A7A8A] focus:outline-none focus:ring-2 focus:ring-[#00b2b2] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Password field */}
      {!showVerification && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#111439] mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#111439] placeholder-[#5A7A8A] focus:outline-none focus:ring-2 focus:ring-[#00b2b2] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
      )}

      {/* Consent checkbox — only for signup (Ley 1581 art.9 + art.26, Ley 527 conservable) */}
      {mode === "signup" && !showVerification && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              id="acceptPrivacy"
              type="checkbox"
              checked={acceptBase}
              onChange={(e) => setAcceptBase(e.target.checked)}
              required
              aria-required="true"
              disabled={isSubmitting}
              className="mt-1 h-4 w-4 shrink-0 rounded border-[#E2E8F0] text-[#00b2b2] focus:ring-2 focus:ring-[#00b2b2] focus:ring-offset-0"
            />
            <label
              htmlFor="acceptPrivacy"
              className="text-sm leading-snug text-[#111439]"
            >
              Acepto la{" "}
              <a
                href="/politica-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#00b2b2] underline underline-offset-2 hover:text-[#009f9f]"
              >
                Política de Privacidad
              </a>{" "}
              ({CURRENT_POLICY_VERSION}), finalidades F-01 a F-07 y
              transferencia internacional a EE.UU. (Clerk/Supabase/Vercel)
              art.26 y{" "}
              <a
                href="/aviso-legal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#00b2b2] underline underline-offset-2 hover:text-[#009f9f]"
              >
                Aviso Legal
              </a>
              .
            </label>
          </div>
          <p className="ml-7 text-xs leading-relaxed text-[#5A7A8A]">
            Podés revocar en{" "}
            <a
              href="mailto:invitro.code@gmail.com"
              className="underline underline-offset-2 hover:text-[#111439]"
            >
              invitro.code@gmail.com
            </a>{" "}
            (art.8) — ver derechos en la política.
          </p>
        </div>
      )}

      {/* Verification code field */}
      {showVerification && (
        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-[#111439] mb-2"
          >
            Código de verificación
          </label>
          <p className="text-sm text-[#5A7A8A] mb-2">
            Revisa tu correo electrónico para obtener el código de
            verificación.
          </p>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            required
            autoComplete="one-time-code"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#111439] placeholder-[#5A7A8A] focus:outline-none focus:ring-2 focus:ring-[#00b2b2] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isLoaded || isSubmitting}
        className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-[#00b2b2] hover:bg-[#009f9f] focus:outline-none focus:ring-2 focus:ring-[#00b2b2] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {showVerification ? "Verificando..." : "Continuar..."}
          </span>
        ) : showVerification ? (
          "Verificar código"
        ) : (
          "Continuar"
        )}
      </button>
    </form>
  );
}
