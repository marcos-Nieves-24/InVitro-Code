import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface NexusShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
}

export function NexusShell({
  children,
  userName,
  userMeta,
}: NexusShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AppSidebar userName={userName} userMeta={userMeta} />
      <main className="flex-1 pb-12 md:pl-[280px]">{children}</main>
    </div>
  );
}