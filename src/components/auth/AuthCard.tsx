"use client";

import { type ReactNode } from "react";
import { LiquidWave, type AuthStatus } from "./LiquidWave";

interface AuthCardProps {
  children: ReactNode;
  status: AuthStatus;
  mode: "signin" | "signup";
  title: string;
  subtitle?: string;
}

export function AuthCard({
  children,
  status,
  mode,
  title,
  subtitle,
}: AuthCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main card container */}
      <div
        className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-[#00b2b2]/10 border border-[#00b2b2]/20 overflow-hidden"
        style={{
          minHeight: "480px",
        }}
      >
        {/* Card content */}
        <div className="relative z-10 px-8 pt-10 pb-32">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#111439] mb-2">{title}</h1>
            {subtitle && (
              <p className="text-sm text-[#5A7A8A]">{subtitle}</p>
            )}
          </div>

          {/* Form content */}
          <div className="space-y-6">{children}</div>
        </div>

        {/* Liquid Wave animation */}
        <LiquidWave status={status} mode={mode} />
      </div>
    </div>
  );
}
