"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export interface UseTypewriterOpts {
  speed?: number;
}

export function useTypewriter(
  text: string,
  opts?: UseTypewriterOpts
): { displayed: string; done: boolean } {
  const speed = opts?.speed ?? 35;
  const shouldReduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(() =>
    shouldReduceMotion ? text : ""
  );
  const [done, setDone] = useState(() =>
    shouldReduceMotion ? true : text.length === 0
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    let index = 0;

    const tick = () => {
      if (!mountedRef.current) return;
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        setDone(true);
        return;
      }
      timeoutRef.current = setTimeout(tick, speed);
    };

    timeoutRef.current = setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, shouldReduceMotion]);

  return { displayed, done };
}
