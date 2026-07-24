import { Callout } from "@/components/ui";

export function CalloutCheck({ children }: { children: React.ReactNode }) {
  return <Callout variant="warning">{children}</Callout>;
}
