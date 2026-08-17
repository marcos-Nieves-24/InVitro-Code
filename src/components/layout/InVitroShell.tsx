"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface InVitroShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
}

export function InVitroShell({
  children,
  userName,
  userMeta,
}: InVitroShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AppSidebar
        userName={userName}
        userMeta={userMeta}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className={`flex-1 pb-12 transition-[padding] duration-300 ${
          collapsed ? "md:pl-[72px]" : "md:pl-[280px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}