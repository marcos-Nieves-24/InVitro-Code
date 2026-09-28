"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * SSO callback handler for Clerk Core 3 API (signIn.sso()).
 *
 * Handles every OAuth redirect state:
 * - signIn.complete          → finalize the session
 * - signUp.isTransferable    → transfer to sign-in
 * - signIn.isTransferable    → transfer to sign-up
 * - existingSession          → clerk.setActive()
 *
 * Based on the official Clerk pattern:
 * https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections
 */
export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current || !signIn) return;

      // Clerk processes the OAuth callback asynchronously. While the sign-in
      // resource is still unhydrated, every branch below would miss and
      // silently bounce the user back to /sign-in. Wait for it instead.
      const status = signIn.status as string | undefined;
      if (!status || status === "needs_identifier") {
        // Safety net: this page must never spin forever if it is opened
        // without a real callback in progress.
        if (!fallbackRef.current) {
          fallbackRef.current = setTimeout(() => {
            if (!hasRun.current) {
              hasRun.current = true;
              router.push("/sign-in");
            }
          }, 8_000);
        }
        return;
      }

      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
      hasRun.current = true;

      const navigateToSignIn = () => router.push("/sign-in");

      const finalizeSignIn = async () => {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      };

      const finalizeSignUp = async () => {
        await signUp.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      };

      // Sign-in finished — finalize it.
      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      // The sign-up matched an existing account — transfer it to a sign-in.
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if ((signIn.status as string) === "complete") {
          await finalizeSignIn();
          return;
        }
        return navigateToSignIn();
      }

      // Needs a first factor we cannot satisfy here.
      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (f) => f.strategy === "enterprise_sso",
        )
      ) {
        return navigateToSignIn();
      }

      // The OAuth account has no user yet — transfer to a sign-up.
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        // The OAuth account still needs information (for example a GitHub
        // account without a verified email). Surface it instead of silently
        // bouncing the user with no session and no explanation.
        if (signUp.status === "missing_requirements") {
          console.warn(
            "OAuth sign-up requires additional requirements:",
            signUp.status,
          );
          router.push("/sign-in?oauth=missing_requirements");
          return;
        }
        return navigateToSignIn();
      }

      // Sign-up finished — finalize it.
      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      // MFA or password reset required — send the user back to sign-in.
      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        return navigateToSignIn();
      }

      // An existing session on this client — activate it.
      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({
            session: sessionId,
            navigate: async ({ session, decorateUrl }) => {
              if (session?.currentTask) {
                console.log("Session task:", session.currentTask);
                return;
              }
              const url = decorateUrl("/");
              if (url.startsWith("http")) {
                window.location.href = url;
              } else {
                router.push(url);
              }
            },
          });
          return;
        }
      }

      navigateToSignIn();
    })();
    // NOTE: no cleanup here. Clerk re-creates the signIn/signUp objects, so
    // this effect re-runs; clearing the fallback timer on every re-run would
    // prevent it from ever firing. It is cleared on unmount instead.
  }, [clerk, signIn, signUp, router]);

  useEffect(() => {
    return () => {
      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#00b2b2] border-t-transparent" />
        <p className="text-sm text-[#5A7A8A]">Procesando autenticación...</p>
      </div>
      <div id="clerk-captcha" />
    </div>
  );
}
