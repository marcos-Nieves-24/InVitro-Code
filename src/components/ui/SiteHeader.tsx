import Link from "next/link";
import { Button } from "./Button";

type SiteHeaderProps = {
  startHref?: string;
  showDashboard?: boolean;
  showSignIn?: boolean;
  className?: string;
};

export function SiteHeader({
  startHref = "/learn",
  showDashboard = true,
  showSignIn = false,
  className = "",
}: SiteHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between rounded-card border border-gray-200 bg-white px-5 py-3.5 shadow-sm ${className}`}
    >
      <Link href="/" className="group flex flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-brand">
          InVitro-Code
        </span>
        <span className="eyebrow text-[10px] text-gray-400">
          Biotecnología · IA · Python
        </span>
      </Link>

      <nav className="flex items-center gap-2">
        {showDashboard && (
          <Button href="/dashboard" variant="ghost" size="sm">
            Dashboard
          </Button>
        )}
        {showSignIn && (
          <Button href="/sign-in" variant="secondary" size="sm">
            Entrar
          </Button>
        )}
        <Button href={startHref} variant="primary" size="sm">
          Comenzar
        </Button>
      </nav>
    </header>
  );
}
