"use client";

import { useState, type FormEvent } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter, useSearchParams } from "next/navigation";
import { type AuthStatus } from "./LiquidWave";

export type AuthMode = "signin" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onStatusChange?: (status: AuthStatus) => void;
}

export function AuthForm({ mode, onStatusChange }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const safeRedirect = redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : null;
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const isLoaded =
    (signInFetchStatus !== "idle" || !!signIn) &&
    (signUpFetchStatus !== "idle" || !!signUp);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded || isSubmitting) return;

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
            const url = decorateUrl(safeRedirect || "/");
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

        // Sign-up complete — finalize the session
        if (signUp.status === "complete") {
          const { error: finalizeError } = await signUp.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                console.log("Session task:", session.currentTask);
                return;
              }
              const url = decorateUrl(safeRedirect || "/");
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
            const url = decorateUrl(safeRedirect || "/");
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
