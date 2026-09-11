"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnymotionStage } from "./AnymotionStage";
import { AnymotionControls } from "./AnymotionControls";
import { useAnymotionTimeline } from "./hooks/useAnymotionTimeline";

interface AnymotionPlayerProps {
  /** Static HTML served by Next.js, e.g. "/animations/knn-explainer/index.html". */
  src: string;
  /** Accessible label; becomes the stage caption when no explicit caption is given. */
  title?: string;
  /** Caption rendered under the stage (Spanish copy). */
  caption?: React.ReactNode;
  /**
   * Render external play/pause + scrubber controls.
   *
   * External controls require the Anymotion output to load `bridge.js`
   * (shipped by the conversion pipeline). Without it the animation keeps its
   * built-in playback and the scrubber is ignored — note it when authoring.
   */
  controls?: boolean;
  autoPlay?: boolean;
  /** Playback speed multiplier (only meaningful with `controls`). */
  speed?: number;
  className?: string;
}

interface BridgeState {
  ready: boolean;
  time: number;
  duration: number;
}

/**
 * Embeds an Anymotion HTML animation inside the lesson layout.
 *
 * Primary integration point between Anymotion output and the MDX lessons.
 * Renders the animation in a sandboxed iframe (faithful rendering of the
 * generated HTML/CSS/JS) and optionally drives it from outside through a
 * tiny postMessage bridge:
 *
 *   parent → iframe: { type: "anymotion-control", payload: { action, t } }
 *   iframe → parent: { type: "anymotion-ready"|"anymotion-time", payload }
 *
 * When `controls` is off, the animation's own playback buttons handle
 * play/pause and nothing is injected into the payload.
 */
export function AnymotionPlayer({
  src,
  title = "Animación",
  caption,
  controls = false,
  autoPlay = false,
  speed = 1,
  className = "",
}: AnymotionPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [bridge, setBridge] = useState<BridgeState>({
    ready: false,
    time: 0,
    duration: 0,
  });

  // Parent-side timeline drives external controls.
  const timeline = useAnymotionTimeline({
    duration: bridge.duration || 10,
    autoPlay: false,
  });

  const post = useCallback((action: "play" | "pause" | "seek", t?: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "anymotion-control", payload: { action, t } },
      "*",
    );
  }, []);

  // When controls are active, the parent owns playback and tells the iframe
  // exactly which frame to render every tick.
  useEffect(() => {
    if (!controls) return;
    post("seek", timeline.time * speed);
  }, [timeline.time, controls, post, speed]);

  useEffect(() => {
    if (!controls) return;
    if (autoPlay && !timeline.isPlaying) timeline.play();
  }, [controls, autoPlay, timeline]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || msg.type === undefined) return;
      if (msg.type === "anymotion-ready") {
        setBridge({
          ready: true,
          time: 0,
          duration: Number(msg.payload?.duration) || 0,
        });
      } else if (msg.type === "anymotion-time") {
        setBridge((prev) => ({
          ...prev,
          time: Number(msg.payload?.time) || 0,
        }));
      }
    },
    [],
  );

  useEffect(() => {
    if (!controls) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [controls, handleMessage]);

  const handlePlayPause = useCallback(() => {
    timeline.toggle();
    post(timeline.isPlaying ? "pause" : "play");
  }, [timeline, post]);

  const handleSeek = useCallback(
    (t: number) => {
      // Seek in the effective animation timeline (speed-adjusted).
      timeline.seek(t / (speed || 1));
      post("seek", t);
    },
    [timeline, post, speed],
  );

  return (
    <figure className={`my-5 first:mt-0 ${className}`}>
      <AnymotionStage title={title}>
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts"
          className="h-full w-full border-0"
        />
      </AnymotionStage>

      {controls && bridge.ready && (
        <AnymotionControls
          isPlaying={timeline.isPlaying}
          currentTime={timeline.time * speed}
          duration={(bridge.duration || timeline.duration) * speed}
          speed={speed}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
      )}

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-[11px] text-storm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}