"use client";

import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { type AuthStatus } from "@/components/auth/LiquidWave";

export default function SignUpPage() {
  const [status, setStatus] = useState<AuthStatus>("idle");

  return (
    <AuthShell variant="sign-up">
      <AuthCard
        status={status}
        mode="signup"
        title="Crear cuenta"
        subtitle="Únete a InVitro-Code"
      >
        <AuthForm mode="signup" onStatusChange={setStatus} />
        <SocialButtons />
      </AuthCard>
    </AuthShell>
  );
}
