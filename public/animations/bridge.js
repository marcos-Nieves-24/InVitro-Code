/**
 * bridge.js — optional postMessage bridge for Anymotion output.
 *
 * Lets an embedding host (AnymotionPlayer with `controls`) drive the
 * animation's playback from outside the iframe. Requires the animation to
 * expose the standard Anymotion contract: `window.DURATION` + `window.seek(t)`.
 *
 * Protocol:
 *   host → iframe: { type: "anymotion-control", payload: { action, t } }
 *       action: "play" | "pause" | "seek"     t?: seconds
 *   iframe → host: { type: "anymotion-ready", payload: { duration } }
 *                 { type: "anymotion-time",  payload: { time, duration, isPlaying } }
 *
 * The bridge republishes each seek as a time event so the host can reflect
 * scrubs initiated inside the animation (e.g. when it exposes its own UI).
 */
(function () {
  "use strict";

  if (window.__anymotionBridgeInstalled) return;
  window.__anymotionBridgeInstalled = true;

  var DURATION = Number(window.DURATION) || 0;
  var isPlaying = false;
  var lastNow = null;
  var rafId = null;

  function seek(t) {
    if (typeof window.seek === "function") {
      window.seek(t);
    }
    postTime(t);
  }

  function postTime(t) {
    try {
      window.parent.postMessage(
        {
          type: "anymotion-time",
          payload: { time: t, duration: DURATION, isPlaying: isPlaying },
        },
        "*",
      );
    } catch (e) {
      /* cross-origin parent: bridge degrades to in-frame controls */
    }
  }

  function tick(now) {
    if (!isPlaying) return;
    var dt = lastNow ? (now - lastNow) / 1000 : 0;
    lastNow = now;
    var current = Math.min(DURATION, currentTime() + dt);
    if (typeof window.seek === "function") window.seek(current);
    postTime(current);
    if (current >= DURATION) {
      isPlaying = false;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function currentTime() {
    return typeof window.__anymotionBridgeTime === "number"
      ? window.__anymotionBridgeTime
      : 0;
  }

  window.addEventListener("message", function (event) {
    var msg = event.data;
    if (!msg || msg.type !== "anymotion-control") return;
    var payload = msg.payload || {};
    switch (payload.action) {
      case "play":
        if (currentTime() >= DURATION) {
          window.__anymotionBridgeTime = 0;
        }
        isPlaying = true;
        lastNow = null;
        if (!rafId) rafId = requestAnimationFrame(tick);
        break;
      case "pause":
        isPlaying = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        break;
      case "seek":
        isPlaying = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        window.__anymotionBridgeTime = Math.max(
          0,
          Math.min(DURATION, Number(payload.t) || 0),
        );
        seek(window.__anymotionBridgeTime);
        break;
    }
  });

  try {
    window.parent.postMessage(
      { type: "anymotion-ready", payload: { duration: DURATION } },
      "*",
    );
  } catch (e) {
    /* not embedded */
  }

  // Initial frame.
  if (typeof window.seek === "function") window.seek(0);
})();