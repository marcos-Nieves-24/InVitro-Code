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
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const durationRef = useRef(duration);
  const playingRef = useRef(autoPlay);
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