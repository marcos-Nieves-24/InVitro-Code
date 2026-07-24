import { Callout } from "@/components/ui";

export function CalloutInfo({ children }: { children: React.ReactNode }) {
  return <Callout variant="info">{children}</Callout>;
}
