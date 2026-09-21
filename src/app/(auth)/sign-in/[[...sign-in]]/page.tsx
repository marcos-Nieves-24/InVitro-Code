"use client";

import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { type AuthStatus } from "@/components/auth/LiquidWave";

export default function SignInPage() {
  const [status, setStatus] = useState<AuthStatus>("idle");

  return (
    <AuthShell variant="sign-in">
      <AuthCard
        status={status}
        mode="signin"
        title="Iniciar sesión"
        subtitle="Bienvenido de vuelta"
      >
        <AuthForm mode="signin" onStatusChange={setStatus} />
        <SocialButtons />
      </AuthCard>
    </AuthShell>
  );
}
