"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      // 1. Sign-in completo
      if (signIn.status === "complete") {
        const { error } = await signIn.finalize();
        if (!error) {
          window.location.href = "/";
        } else {
          console.error("signIn.finalize error:", error);
          router.push("/sign-in");
        }
        return;
      }

      // 2. Sign-up transferible → crear sign-in
      if (signUp.isTransferable) {
        const { error: transferError } = await signIn.create({
          transfer: true,
        });
        if (!transferError && (signIn.status as string) === "complete") {
          const { error } = await signIn.finalize();
          if (!error) {
            window.location.href = "/";
          } else {
            console.error("signIn finalize after transfer error:", error);
            router.push("/sign-in");
          }
          return;
        }
        router.push("/sign-in");
        return;
      }

      // 3. Sign-in transferible → crear sign-up
      if (signIn.isTransferable) {
        const { error: transferError } = await signUp.create({
          transfer: true,
        });
        if (!transferError && (signUp.status as string) === "complete") {
          const { error } = await signUp.finalize();
          if (!error) {
            window.location.href = "/";
          } else {
            console.error("signUp finalize after transfer error:", error);
            router.push("/sign-in");
          }
          return;
        }
        router.push("/sign-in");
        return;
      }

      // 4. Sign-up completo
      if (signUp.status === "complete") {
        const { error } = await signUp.finalize();
        if (!error) {
          window.location.href = "/";
        } else {
          console.error("signUp.finalize error:", error);
          router.push("/sign-in");
        }
        return;
      }

      // 5. Sesión existente activa
      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId });
          window.location.href = "/";
          return;
        }
      }

      // 6. Fallback
      router.push("/sign-in");
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-[#5A7A8A]">Procesando autenticación...</p>
      {/* Required for sign-up flows — Clerk's bot sign-up protection */}
      <div id="clerk-captcha" />
    </div>
  );
}
