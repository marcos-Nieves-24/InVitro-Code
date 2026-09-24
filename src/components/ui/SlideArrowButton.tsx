"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export interface SlideArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  primaryColor?: string;
  href?: string;
}

export function SlideArrowButton({
  text = "Get Started",
  primaryColor = "var(--color-brand-400)",
  className = "",
  href,
  ...props
}: SlideArrowButtonProps) {
  const inner = (
    <>
      <div
        className="absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover/slide:w-full"
        style={{ backgroundColor: primaryColor }}
        aria-hidden="true"
      >
        <span className="mr-3 text-white">
          <ArrowRight size={20} />
        </span>
      </div>
      <span className="relative left-4 z-10 whitespace-nowrap px-8 font-semibold text-black transition-all duration-200 group-hover/slide:-left-3 group-hover/slide:text-white">
        {text}
      </span>
    </>
  );

  const baseClass = `group/slide relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-white p-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-400)] ${className}`;

  if (href) {
    const { type: _type, ..._rest } = props;
    void _type;
    void _rest;
    return (
      <Link href={href} className={baseClass} aria-label={text}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClass} aria-label={text} {...props}>
      {inner}
    </button>
  );
}

export default SlideArrowButton;
