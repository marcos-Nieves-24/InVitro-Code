/* =========================================================
   timeline.js — Deterministic seek engine for spinner
   3-second spinning loading animation
   ========================================================= */
(function () {
  'use strict';

  window.DURATION = 3;

  /* ── DOM References (null-safe) ── */
  const stage         = document.getElementById('stage');
  const ring          = document.getElementById('spinnerRing');
  const halo          = document.getElementById('spinnerHalo');
  const dot           = document.getElementById('spinnerDot');
  const dotsEl        = document.getElementById('loadingDots');
  const orbA          = document.querySelector('.orb-a');
  const orbB          = document.querySelector('.orb-b');
  const playBtn       = document.getElementById('playbtn');
  const tcEl          = document.getElementById('tc');

  /* ── Helpers ── */
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const wrap01 = (v) => ((v % 1) + 1) % 1;

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(2).padStart(5, '0');
    return m + ':' + s + ' / 0:03.00';
  }

  /* ── Fit stage to window ── */
  function fitStage() {
    const vw = window.innerWidth || 1920;
    const vh = window.innerHeight || 1080;
    const scale = Math.min(vw / 1920, vh / 1080);
    document.documentElement.style.setProperty('--stage-scale', scale);
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  /* ── Seek: the whole contract ──
     Every visual property is computed directly from t — zero accumulation. */
  window.seek = function (t) {
    const dur = window.DURATION;
    t = clamp(t, 0, dur);
    const p = t / dur; // 0..1 progress through the loop

    /* 1. SPINNING RING — continuous rotation.
       3 full rotations over 3 seconds = 1 rotation/sec = 360°/s.
       We use easeInOutCubic for a natural feel: starts slow, speeds up, slows down. */
    if (ring) {
      // Continuous spin: 3 full rotations (1080°) over 3 seconds
      const rot = p * 1080;
      ring.style.transform = `rotate(${rot}deg)`;
      ring.style.opacity = 1;
    }

    /* 2. PULSING HALO — sinusoidal scale and opacity pulse */
    if (halo) {
      const pulse = Math.sin(p * Math.PI * 6) * 0.15 + 1; // range: 0.85..1.15
      const haloOpacity = 0.18 + Math.sin(p * Math.PI * 6) * 0.12; // range: 0.06..0.30
      halo.style.transform = `translate(-50%, -50%) scale(${pulse})`;
      halo.style.opacity = haloOpacity;
    }

    /* 3. INNER DOT — gentle scale breathing */
    if (dot) {
      const dotScale = 1 + Math.sin(p * Math.PI * 4) * 0.2;
      dot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
      dot.style.opacity = 1;
    }

    /* 4. LOADING DOTS — cycling dots animation */
    if (dotsEl) {
      // Cycle through '.', '..', '...' every second
      const cycle = Math.floor(t * 4) % 4; // 0-1-2-3 pattern
      const dotCount = [0, 1, 2, 1][cycle];
      dotsEl.textContent = '.'.repeat(dotCount + 1);
    }

    /* 5. AMBIENT ORB DRIFT — slow background movement */
    if (orbA) {
      const dx1 = Math.sin(t * 0.7) * 20;
      const dy1 = Math.cos(t * 0.5) * 14;
      orbA.style.transform = `translate3d(${dx1}px, ${dy1}px, 0)`;
    }
    if (orbB) {
      const dx2 = Math.cos(t * 0.6) * 16;
      const dy2 = Math.sin(t * 0.8) * 12;
      orbB.style.transform = `translate3d(${dx2}px, ${dy2}px, 0)`;
    }

    /* 6. TIMECODE */
    if (tcEl) tcEl.textContent = fmt(t);
  };

  /* ── Playback Engine ── */
  let isPlaying = false;
  let rafId = null;
  let lastNow = performance.now();
  let currentTime = 0;

  function tick(now) {
    rafId = null;
    const dt = (now - lastNow) / 1000;
    lastNow = now;

    if (isPlaying) {
      currentTime += dt;
      if (currentTime >= window.DURATION) {
        currentTime = window.DURATION;
        isPlaying = false;
        syncPlayBtn(false);
        window.seek(currentTime);
        if (tcEl) tcEl.textContent = fmt(currentTime);
        return;
      }
      window.seek(currentTime);
      rafId = requestAnimationFrame(tick);
    }
  }

  function syncPlayBtn(playing) {
    if (playBtn) playBtn.textContent = playing ? '❚❚' : '▶';
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    lastNow = performance.now();
    syncPlayBtn(isPlaying);
    if (isPlaying && !rafId) rafId = requestAnimationFrame(tick);
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });

  /* ── Init: render first frame ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.seek(0);
    });
  } else {
    window.seek(0);
  }

})();
