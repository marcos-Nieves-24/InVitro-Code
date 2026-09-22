import { HeroBanner } from "./HeroBanner";

export interface HeroSectionProps {
  userName: string;
  startHref: string;
  gender?: string | null;
}

export function HeroSection({ userName, startHref, gender }: HeroSectionProps) {
  return <HeroBanner userName={userName} startHref={startHref} gender={gender} />;
}
