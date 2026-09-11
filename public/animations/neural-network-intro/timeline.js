
/* Auto-scale 1920x1080 stage to fit any screen resolution */
function fitStage() {
  var vw = window.innerWidth || 1920, vh = window.innerHeight || 1080;
  var s = Math.min(vw / 1920, vh / 1080);
  document.documentElement.style.setProperty('--stage-scale', s);
}
window.addEventListener('resize', fitStage);
fitStage();
/* ============================================================================
   timeline.js — Animation for Red Neuronal Feedforward
   15-second educational explainer with sequential node entrance,
   connection draw-on, data pulse waves, and ambient glow.
   ============================================================================ */
(function () {
  'use strict';

  var DURATION = 15000;
  var tl = new Timeline({ duration: DURATION, fps: 60, width: 1920, height: 1080 });

  /* === NODE CENTER POSITIONS (1920×1080 stage) === */
  var IN  = [{x:300,y:370},{x:300,y:540},{x:300,y:710}];          // x1 x2 x3
  var HID = [{x:960,y:290},{x:960,y:440},{x:960,y:590},{x:960,y:740}]; // h1 h2 h3 h4
  var OUT = [{x:1620,y:430},{x:1620,y:610}];                       // y1 y2

  /* === DOM LOOKUPS === */
  var nodeEls = {
    x1: document.getElementById('node-x1'),
    x2: document.getElementById('node-x2'),
    x3: document.getElementById('node-x3'),
    h1: document.getElementById('node-h1'),
    h2: document.getElementById('node-h2'),
    h3: document.getElementById('node-h3'),
    h4: document.getElementById('node-h4'),
    y1: document.getElementById('node-y1'),
    y2: document.getElementById('node-y2')
  };
  var conns   = document.querySelectorAll('.conn');
  var weights = document.querySelectorAll('.weight-label');
  var pulses  = document.querySelectorAll('.pulse-dot');

  /* === INIT: measure connection lengths and set dasharray === */
  var lineLens = [];
  conns.forEach(function (ln, i) {
    var x1 = ln.x1.baseVal.value, y1 = ln.y1.baseVal.value;
    var x2 = ln.x2.baseVal.value, y2 = ln.y2.baseVal.value;
    var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    lineLens[i] = len;
    ln.style.strokeDasharray  = len;
    ln.style.strokeDashoffset = len;
  });

  /* === SET INITIAL POSES === */
  tl.set('#title-bar',       { opacity: 0, y: -24 });
  tl.set('#label-entrada',   { opacity: 0, y: 10 });
  tl.set('#label-oculta',    { opacity: 0, y: 10 });
  tl.set('#label-salida',    { opacity: 0, y: 10 });
  document.querySelectorAll('.nn-node').forEach(function (n) {
    tl.set(n, { opacity: 0, scale: 0.5 });
  });
  weights.forEach(function (w) { tl.set(w, { opacity: 0, y: 6 }); });
  tl.set('#legend-bar', { opacity: 0, y: 18 });
  tl.set('#accent-line', { opacity: 0 });
  pulses.forEach(function (p) { tl.set(p, { opacity: 0 }); });

  /* =========================================================================
     PHASE 1 — TITLE ENTRANCE (0–2 s)
     ========================================================================= */
  tl.add('#title-bar', {
    at: 0, dur: 1400, ease: 'outExpo',
    opacity: [0, 1], y: [-24, 0]
  });
  tl.cue('whoosh', 0, { gain: 0.35, dur: 1200 });

  /* =========================================================================
     PHASE 2 — LAYER LABELS (0.5–2 s)
     ========================================================================= */
  tl.add('#label-entrada', { at: 500, dur: 800, ease: 'outQuart', opacity: [0, 0.55], y: [10, 0] });
  tl.add('#label-oculta',  { at: 850, dur: 800, ease: 'outQuart', opacity: [0, 0.55], y: [10, 0] });
  tl.add('#label-salida',  { at: 1200, dur: 800, ease: 'outQuart', opacity: [0, 0.55], y: [10, 0] });

  /* =========================================================================
     PHASE 3 — NODE ENTRANCE (1.5–5.5 s)  staggered layer-by-layer
     ========================================================================= */
  // Input layer
  ['#node-x1', '#node-x2', '#node-x3'].forEach(function (sel, i) {
    tl.add(sel, {
      at: 1500 + i * 200, dur: 850,
      ease: 'outBack',
      opacity: [0, 1], scale: [0.5, 1]
    });
    tl.cue('pop', 1500 + i * 200, { gain: 0.35, pitch: 1.0 + i * 0.06 });
  });

  // Hidden layer
  ['#node-h1', '#node-h2', '#node-h3', '#node-h4'].forEach(function (sel, i) {
    tl.add(sel, {
      at: 2800 + i * 160, dur: 850,
      ease: 'outBack',
      opacity: [0, 1], scale: [0.5, 1]
    });
    tl.cue('pop', 2800 + i * 160, { gain: 0.32, pitch: 0.92 + i * 0.04 });
  });

  // Output layer
  ['#node-y1', '#node-y2'].forEach(function (sel, i) {
    tl.add(sel, {
      at: 4200 + i * 200, dur: 850,
      ease: 'outBack',
      opacity: [0, 1], scale: [0.5, 1]
    });
    tl.cue('pop', 4200 + i * 200, { gain: 0.35, pitch: 1.08 + i * 0.05 });
  });

  /* =========================================================================
     PHASE 4 — CONNECTION LINES DRAW ON (4–7.5 s)
     ========================================================================= */
  // Input → Hidden (12 lines, IDs in DOM order)
  var i2h = [
    '#c-x1-h1', '#c-x1-h2', '#c-x1-h3', '#c-x1-h4',
    '#c-x2-h1', '#c-x2-h2', '#c-x2-h3', '#c-x2-h4',
    '#c-x3-h1', '#c-x3-h2', '#c-x3-h3', '#c-x3-h4'
  ];
  i2h.forEach(function (sel, i) {
    tl.add(sel, {
      at: 4200 + i * 65, dur: 800,
      ease: 'outQuint',
      opacity: [0, 1],
      strokeDashoffset: [lineLens[i], 0]
    });
  });

  // Hidden → Output (8 lines)
  var h2o = [
    '#c-h1-y1', '#c-h1-y2', '#c-h2-y1', '#c-h2-y2',
    '#c-h3-y1', '#c-h3-y2', '#c-h4-y1', '#c-h4-y2'
  ];
  h2o.forEach(function (sel, i) {
    var idx = 12 + i; // offset into lineLens array
    tl.add(sel, {
      at: 5600 + i * 65, dur: 800,
      ease: 'outQuint',
      opacity: [0, 1],
      strokeDashoffset: [lineLens[idx], 0]
    });
  });

  tl.cue('tick', 5000, { gain: 0.2 });

  /* =========================================================================
     PHASE 5 — DATA PULSE WAVES (7–12 s)
     Managed in tl.loop() since positions are per-frame calculations.
     ========================================================================= */
  var wave1 = [
    // from input node → hidden node (6 pulses)
    { el: '#pulse-1', fx: IN[0].x, fy: IN[0].y, tx: HID[1].x, ty: HID[1].y, t0: 7200, dur: 2100 },
    { el: '#pulse-2', fx: IN[1].x, fy: IN[1].y, tx: HID[2].x, ty: HID[2].y, t0: 7400, dur: 2100 },
    { el: '#pulse-3', fx: IN[2].x, fy: IN[2].y, tx: HID[3].x, ty: HID[3].y, t0: 7600, dur: 2100 },
    { el: '#pulse-4', fx: IN[0].x, fy: IN[0].y, tx: HID[0].x, ty: HID[0].y, t0: 7800, dur: 2100 },
    { el: '#pulse-5', fx: IN[1].x, fy: IN[1].y, tx: HID[1].x, ty: HID[1].y, t0: 8000, dur: 2100 },
    { el: '#pulse-6', fx: IN[2].x, fy: IN[2].y, tx: HID[2].x, ty: HID[2].y, t0: 8200, dur: 2100 }
  ];
  var wave2 = [
    // from hidden node → output node (3 pulses)
    { el: '#pulse-w2-1', fx: HID[1].x, fy: HID[1].y, tx: OUT[0].x, ty: OUT[0].y, t0: 10000, dur: 1900 },
    { el: '#pulse-w2-2', fx: HID[2].x, fy: HID[2].y, tx: OUT[1].x, ty: OUT[1].y, t0: 10200, dur: 1900 },
    { el: '#pulse-w2-3', fx: HID[0].x, fy: HID[0].y, tx: OUT[0].x, ty: OUT[0].y, t0: 10400, dur: 1900 }
  ];
  var allPulses = wave1.concat(wave2);

  /* =========================================================================
     PHASE 6 — WEIGHT LABELS (9–11 s)
     ========================================================================= */
  ['#w1', '#w2', '#w3', '#w4', '#w5'].forEach(function (sel, i) {
    tl.add(sel, {
      at: 9000 + i * 220, dur: 700,
      ease: 'outQuart',
      opacity: [0, 0.65], y: [6, 0]
    });
  });

  /* =========================================================================
     PHASE 7 — LEGEND + ACCENT LINE (11–14 s)
     ========================================================================= */
  tl.add('#legend-bar', {
    at: 11200, dur: 1000, ease: 'outQuart',
    opacity: [0, 1], y: [18, 0]
  });
  tl.cue('chime', 11500, { gain: 0.4 });
  tl.add('#accent-line', {
    at: 12200, dur: 1500, ease: 'outQuint',
    opacity: [0, 0.55]
  });
  tl.cue('success', 12800, { gain: 0.35 });

  /* =========================================================================
     CONTINUOUS LOOP — pulses, node activation, ambient motion
     All pure functions of t for deterministic seeking.
     ========================================================================= */
  // Mapping: which hidden index each wave1 pulse targets
  var w1TargetH = [1, 2, 3, 0, 1, 2];   // h2 h3 h4 h1 h2 h3
  // Mapping: which output index each wave2 pulse targets
  var w2TargetY = [0, 1, 0];              // y1 y2 y1

  tl.loop(function (t) {
    var i, p, el, prg, e, x, y, fi, fo;

    /* --- Pulse positions --- */
    for (i = 0; i < allPulses.length; i++) {
      p  = allPulses[i];
      el = document.querySelector(p.el);
      if (!el) continue;
      prg = (t - p.t0) / p.dur;
      if (prg < -0.05 || prg > 1.05) { el.style.opacity = '0'; continue; }
      prg = Math.max(0, Math.min(1, prg));
      e = Ease.outCubic(prg);
      x = p.fx + (p.tx - p.fx) * e;
      y = p.fy + (p.ty - p.fy) * e;
      el.setAttribute('cx', x.toFixed(1));
      el.setAttribute('cy', y.toFixed(1));
      fi = Math.min(1, prg * 5);       // fast fade in
      fo = Math.min(1, (1 - prg) * 5); // fast fade out
      el.style.opacity = (fi * fo).toFixed(3);
    }

    /* --- Node activation: hidden layer --- */
    for (i = 0; i < wave1.length; i++) {
      var arrival = wave1[i].t0 + wave1[i].dur * 0.92;
      if (t >= arrival) {
        var hKey = ['h1','h2','h3','h4'][w1TargetH[i]];
        if (nodeEls[hKey]) nodeEls[hKey].classList.add('is-active');
      }
    }
    /* --- Node activation: output layer --- */
    for (i = 0; i < wave2.length; i++) {
      var arr2 = wave2[i].t0 + wave2[i].dur * 0.92;
      if (t >= arr2) {
        var yKey = ['y1','y2'][w2TargetY[i]];
        if (nodeEls[yKey]) nodeEls[yKey].classList.add('is-active');
      }
    }

    /* --- Ambient: background orb drift (deterministic, never CSS keyframes) --- */
    var orbs = document.querySelectorAll('.bg-orb');
    if (orbs.length >= 3) {
      orbs[0].style.transform =
        'translate3d(' + (Math.sin(t / 5200) * 22).toFixed(1) + 'px,' +
        (Math.cos(t / 7200) * 16).toFixed(1) + 'px,0) scale(1.08)';
      orbs[1].style.transform =
        'translate3d(' + (Math.cos(t / 6100) * 19).toFixed(1) + 'px,' +
        (Math.sin(t / 4600) * 13).toFixed(1) + 'px,0) scale(1.05)';
      orbs[2].style.transform =
        'translate3d(' + (Math.sin(t / 8200) * 15).toFixed(1) + 'px,' +
        (Math.cos(t / 5800) * 11).toFixed(1) + 'px,0) scale(1.06)';
    }

    /* --- Ambient: subtle node breathing once network is alive (t > 10s) --- */
    if (t > 10000) {
      var breathe = 1 + Math.sin(t / 1800) * 0.015;
      document.querySelectorAll('.nn-node.is-active .node-ring').forEach(function (r) {
        r.style.transform = 'scale(' + breathe.toFixed(4) + ')';
      });
    }
  });

  /* =========================================================================
     SFX CUES
     ========================================================================= */
  tl.cue('tick', 4800, { gain: 0.25 });
  tl.cue('tick', 5600, { gain: 0.25 });
  tl.cue('whoosh', 7000, { gain: 0.28, dur: 2200 });
  tl.cue('tick', 10000, { gain: 0.25 });

/* =========================================================================
WINDOW CONTRACTS (editor / renderer use window.seek and window.DURATION)
========================================================================= */
window.DURATION = DURATION / 1000;
window.seek = function (t) { tl.seek(t * 1000); };

/* =========================================================================
MOUNT — stage scaling, controls, render harness
========================================================================= */
tl.mount();
}());
