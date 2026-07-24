import { SignIn } from "@clerk/nextjs";
import { PageShell, SiteHeader } from "@/components/ui";

export default function SignInPage() {
  return (
    <PageShell width="marketing">
      <SiteHeader showDashboard showSignIn={false} />
      <div className="mt-10 flex justify-center pb-16">
        <div className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
          <p className="eyebrow mb-4 text-center">Acceso</p>
          <h1 className="mb-6 text-center font-display text-xl font-semibold tracking-tight text-gray-900">
            InVitro-Code
          </h1>
          <SignIn />
        </div>
      </div>
    </PageShell>
  );
}
