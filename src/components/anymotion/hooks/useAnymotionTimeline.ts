"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface AnymotionTimelineOptions {
  duration: number;
  autoPlay?: boolean;
  fps?: number;
}

export interface AnymotionTimeline {
  /** Current playback time in seconds (0..duration). */
  time: number;
  /** Whether the timeline is currently advancing. */
  isPlaying: boolean;
  /** Total duration in seconds. */
  duration: number;
  /** Normalized progress 0..1. */
  progress: number;
  /** Start playing from the current position. */
  play: () => void;
  /** Pause at the current position. */
  pause: () => void;
  /** Toggle play/pause. */
  toggle: () => void;
  /** Jump to an absolute time in seconds (clamped to 0..duration). */
  seek: (t: number) => void;
  /** Reset to t=0 and stop. */
  reset: () => void;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function readReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Tracks the user's `prefers-reduced-motion: reduce` setting.
 *
 * Reads the current value synchronously for the first render and subscribes to
 * the media query, so a later OS-level change is reflected live without a
 * remount. Falls back to `false` during SSR, where there is no `window`.
 */
function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(readReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setPrefers(mediaQuery.matches);
    // Resync in case the value changed between the initial render and mount.
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefers;
}

/**
 * Deterministic timeline engine for Anymotion animations.
 *
 * Mirrors the contract Anymotion outputs expose (`window.DURATION` +
 * `window.seek(t)`): every frame descends from a single time value stored
 * here, driven by requestAnimationFrame. Nothing accumulates state, so the
 * animation is deterministic — scrubbing to any t renders that exact frame.
 */
export function useAnymotionTimeline({
  duration,
  autoPlay = false,
}: AnymotionTimelineOptions): AnymotionTimeline {
  const prefersReducedMotion = usePrefersReducedMotion();
  // When the user prefers reduced motion, never auto-play: the timeline rests
  // at t=0 so the component renders its first keyframe statically.
  const startPlaying = autoPlay && !prefersReducedMotion;
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(startPlaying);

  const durationRef = useRef(duration);
  const playingRef = useRef(startPlaying);
  const timeRef = useRef(0);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    durationRef.current = duration;
    if (timeRef.current > duration) {
      timeRef.current = duration;
      setTime(duration);
    }
  }, [duration]);

  const frame = useCallback((now: number) => {
    if (!playingRef.current) return;
    const dt = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0;
    lastFrameRef.current = now;
    const dur = durationRef.current;
    const next = Math.min(timeRef.current + dt, dur);
    timeRef.current = next;
    setTime(next);
    if (next >= dur) {
      playingRef.current = false;
      setIsPlaying(false);
      lastFrameRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  const play = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    lastFrameRef.current = 0;
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(frame);
  }, [frame]);

  const pause = useCallback(() => {
    playingRef.current = false;
    lastFrameRef.current = 0;
    setIsPlaying(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const seek = useCallback((t: number) => {
    const clamped = Math.max(0, Math.min(durationRef.current, t));
    timeRef.current = clamped;
    setTime(clamped);
  }, []);

  const reset = useCallback(() => {
    pause();
    seek(0);
  }, [pause, seek]);

  // Kick off playback on mount only when autoPlay is requested and motion is
  // allowed. Reduced-motion users stay on the first keyframe (see startPlaying).
  // The teardown re-arms the guarded play()/pause() pair across React Strict
  // Mode's mount/unmount/remount cycle.
  useEffect(() => {
    if (!startPlaying) return;
    play();
    return () => pause();
    // Mount-only: the auto-play decision is frozen at first render on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return {
    time,
    isPlaying,
    duration,
    progress: duration > 0 ? time / duration : 0,
    play,
    pause,
    toggle,
    seek,
    reset,
  };
}