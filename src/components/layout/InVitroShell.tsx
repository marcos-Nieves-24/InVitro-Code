"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface InVitroShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
  topBar?: ReactNode;
}

export function InVitroShell({
  children,
  userName,
  userMeta,
  topBar,
}: InVitroShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Set --sidebar-offset on documentElement for ConsoleFrame overlay
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => {
      document.documentElement.style.setProperty(
        "--sidebar-offset",
        mql.matches ? (collapsed ? "72px" : "280px") : "0px"
      );
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <AppSidebar
        userName={userName}
        userMeta={userMeta}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        id="main-content"
        className={`flex-1 pt-14 pb-12 transition-[padding] duration-300 md:pt-0 ${
          collapsed ? "md:pl-[72px]" : "md:pl-[280px]"
        }`}
      >
        {topBar && (
          <div className="sticky top-0 z-40">{topBar}</div>
        )}
        {children}
      </main>
    </div>
  );
}