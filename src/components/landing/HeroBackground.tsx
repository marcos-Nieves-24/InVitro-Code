import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Original lab image as the hero backdrop — crisp and on-brand. */}
      <Image
        src="/landing/landing-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className="pointer-events-none object-cover object-center"
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-[#111439]/60" />
    </div>
  );
}
