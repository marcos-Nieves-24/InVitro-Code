"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Blinker({ cursor }: { cursor?: React.ReactNode }) {
  return (
    <span className="inline-block animate-pulse" aria-hidden="true">
      {cursor ?? <span className="font-bold">|</span>}
    </span>
  );
}

export function SmoothEffect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("inline", className)}>{children}</span>;
}

export function NormalEffect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("inline", className)}>{children}</span>;
}

export function useTypingInterval(text: string, delay: number, smooth: boolean) {
  const [index, setIndex] = useState(0);
  void text;
  void delay;
  void smooth;
  return { index, setIndex };
}

export function useTypingEndpoint(text: string, delay: number) {
  void delay;
  return text.length;
}

export function CursorWrapper({
  children,
  cursor,
  hideOnComplete,
  done,
}: {
  children: React.ReactNode;
  cursor?: React.ReactNode;
  hideOnComplete?: boolean;
  done: boolean;
}) {
  return (
    <>
      {children}
      {!hideOnComplete || !done ? (
        <span className="ml-0.5 inline-block" aria-hidden="true">
          {cursor ?? <Blinker />}
        </span>
      ) : null}
    </>
  );
}

export function Type(props: TypingTextProps) {
  return <TypingText {...props} />;
}

export interface TypingTextProps {
  text: string;
  delay?: number;
  repeat?: boolean;
  cursor?: React.ReactNode;
  className?: string;
  smooth?: boolean;
  hideCursorOnComplete?: boolean;
  startDelay?: number;
}

export function TypingText({
  text,
  delay = 32,
  repeat = false,
  cursor,
  className,
  smooth = false,
  hideCursorOnComplete = false,
  startDelay = 0,
}: TypingTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(() => (shouldReduceMotion ? text : ""));
  const [done, setDone] = useState(() => (shouldReduceMotion ? true : text.length === 0));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (startRef.current) clearTimeout(startRef.current);
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    if (text.length === 0) {
      setDisplayed("");
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let idx = 0;

    const tick = () => {
      if (!mountedRef.current) return;
      idx += 1;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        setDone(true);
        if (repeat) {
          timeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            idx = 0;
            setDisplayed("");
            setDone(false);
            const jitter = smooth ? Math.random() * delay * 0.4 : 0;
            timeoutRef.current = setTimeout(tick, delay + jitter);
          }, 1400);
        }
        return;
      }
      const jitter = smooth ? Math.random() * delay * 0.4 : 0;
      timeoutRef.current = setTimeout(tick, delay + jitter);
    };

    startRef.current = setTimeout(tick, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (startRef.current) clearTimeout(startRef.current);
    };
  }, [text, delay, repeat, smooth, startDelay, shouldReduceMotion]);

  const showCursor = !(hideCursorOnComplete && done);
  const cursorNode = cursor ?? <span className="text-[var(--color-comic-accent)]">█</span>;

  const Effect = smooth ? SmoothEffect : NormalEffect;

  return (
    <span className={cn("font-mono", className)} role="status" aria-live="polite">
      <span className="sr-only">{text}</span>
      <Effect aria-hidden="true">
        <span>{displayed}</span>
        {showCursor ? (
          <span
            className={`ml-0.5 inline-block ${done ? "animate-pulse" : ""}`}
            aria-hidden="true"
          >
            {cursorNode}
          </span>
        ) : null}
      </Effect>
    </span>
  );
}

export default TypingText;
