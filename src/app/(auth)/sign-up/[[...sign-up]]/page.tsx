import { SignUp } from "@clerk/nextjs";
import { PageShell, SiteHeader } from "@/components/ui";

export default function SignUpPage() {
  return (
    <PageShell width="marketing">
      <SiteHeader showDashboard showSignIn={false} />
      <div className="mt-10 flex justify-center pb-16">
        <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
          <p className="eyebrow mb-4 text-center">Crear cuenta</p>
          <h1 className="mb-6 text-center font-display text-xl font-semibold tracking-tight text-ink">
            InVitro-Code
          </h1>
          <SignUp />
        </div>
      </div>
    </PageShell>
  );
}
