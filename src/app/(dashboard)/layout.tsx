import { ConsentBanner } from "@/components/layout/ConsentBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ConsentBanner />
      {children}
    </>
  );
}
