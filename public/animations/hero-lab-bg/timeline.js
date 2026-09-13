/* ============================================================
   timeline.js — Deterministic Seamless-Loop Animation Engine
   Cinematic Scientific Laboratory Background
   Duration: 30s, 60fps, 1920×1080
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. CONSTANTS ─────────────────────────────────────── */
  var DURATION = 30;
  var W = 1920, H = 1080;
  var PI2 = Math.PI * 2;
  var CYAN = '#00b2b2', TEAL = '#005f88', CYAN_B = '#00e5e5';

  window.DURATION = DURATION;

  /* ── 2. DOM LOOKUPS ───────────────────────────────────── */
  var stage, gridOverlay, orbs, dnaGroup, helixGlow;
  var canvas, ctx;
  var barChart, metricSeq, metric1, metric2, metric3, miniChart1;
  var feedItems, nnConnections, nnNodes, nnSvg;
  var scanLine;
  var playBtn, tcEl;

  /* ── 3. EASING HELPERS ────────────────────────────────── */
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── 4. DNA HELIX GENERATION ──────────────────────────── */
  function buildDNA() {
    var svg = document.getElementById('dna-helix');
    if (!svg) return;
    var ns = 'http://www.w3.org/2000/svg';
    var g = document.getElementById('helix-group');
    var nodeCount = 24;
    var spacing = 36;
    var amplitude = 55;
    var startY = 20;

    /* Create strand paths */
    var path1 = document.createElementNS(ns, 'path');
    path1.setAttribute('fill', 'none');
    path1.setAttribute('stroke', 'url(#strand-grad)');
    path1.setAttribute('stroke-width', '2.5');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('opacity', '0.8');
    g.appendChild(path1);

    var path2 = document.createElementNS(ns, 'path');
    path2.setAttribute('fill', 'none');
    path2.setAttribute('stroke', 'url(#strand-grad)');
    path2.setAttribute('stroke-width', '2.5');
    path2.setAttribute('stroke-linecap', 'round');
    path2.setAttribute('opacity', '0.8');
    g.appendChild(path2);

    /* Create rungs */
    var rungs = [];
    for (var i = 0; i < nodeCount; i++) {
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('stroke', 'url(#rung-grad)');
      line.setAttribute('stroke-width', '1.2');
      line.setAttribute('opacity', '0.35');
      line.setAttribute('stroke-linecap', 'round');
      g.appendChild(line);
      rungs.push(line);
    }

    /* Create nodes on strand 1 */
    var nodes1 = [];
    for (var i = 0; i < nodeCount; i++) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('r', '4');
      c.setAttribute('fill', CYAN);
      c.setAttribute('opacity', '0.7');
      g.appendChild(c);
      nodes1.push(c);
    }

    /* Create nodes on strand 2 */
    var nodes2 = [];
    for (var i = 0; i < nodeCount; i++) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('r', '4');
      c.setAttribute('fill', CYAN);
      c.setAttribute('opacity', '0.7');
      g.appendChild(c);
      nodes2.push(c);
    }

    /* Glow nodes (larger, blurred) */
    var glows = [];
    for (var i = 0; i < nodeCount; i++) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('r', '10');
      c.setAttribute('fill', CYAN);
      c.setAttribute('opacity', '0.15');
      c.setAttribute('filter', 'url(#helix-glow)');
      g.appendChild(c);
      glows.push(c);
    }

    /* Store for animation */
    svg._dna = {
      path1: path1, path2: path2,
      rungs: rungs, nodes1: nodes1, nodes2: nodes2, glows: glows,
      nodeCount: nodeCount, spacing: spacing, amplitude: amplitude, startY: startY
    };
  }

  function renderDNA(t) {
    var svg = document.getElementById('dna-helix');
    if (!svg || !svg._dna) return;
    var d = svg._dna;
    var phase = t * PI2 / DURATION; /* Full rotation over DURATION */

    /* Rotate the whole group */
    var rotDeg = (t / DURATION) * 360;
    dnaGroup.setAttribute('transform',
      'translate(150, 450) rotate(' + rotDeg.toFixed(2) + ')');

    /* Build strand paths */
    var p1 = '', p2 = '';
    for (var i = 0; i < d.nodeCount; i++) {
      var y = d.startY + i * d.spacing;
      var angle = phase + i * 0.55;
      var x1 = Math.sin(angle) * d.amplitude;
      var x2 = Math.sin(angle + Math.PI) * d.amplitude;
      var z1 = Math.cos(angle);
      var z2 = Math.cos(angle + Math.PI);

      if (i === 0) { p1 = 'M' + x1 + ' ' + y; p2 = 'M' + x2 + ' ' + y; }
      else { p1 += ' L' + x1.toFixed(1) + ' ' + y; p2 += ' L' + x2.toFixed(1) + ' ' + y; }

      /* Update node positions */
      d.nodes1[i].setAttribute('cx', x1.toFixed(1));
      d.nodes1[i].setAttribute('cy', y);
      d.nodes1[i].setAttribute('opacity', (0.4 + clamp01(z1) * 0.5).toFixed(2));
      d.nodes1[i].setAttribute('r', (3 + clamp01(z1) * 2.5).toFixed(1));

      d.nodes2[i].setAttribute('cx', x2.toFixed(1));
      d.nodes2[i].setAttribute('cy', y);
      d.nodes2[i].setAttribute('opacity', (0.4 + clamp01(z2) * 0.5).toFixed(2));
      d.nodes2[i].setAttribute('r', (3 + clamp01(z2) * 2.5).toFixed(1));

      /* Rungs connect the two strands */
      d.rungs[i].setAttribute('x1', x1.toFixed(1));
      d.rungs[i].setAttribute('y1', y);
      d.rungs[i].setAttribute('x2', x2.toFixed(1));
      d.rungs[i].setAttribute('y2', y);
      var depth = (z1 + z2) / 2;
      d.rungs[i].setAttribute('opacity', (0.12 + clamp01(depth) * 0.3).toFixed(2));

      /* Glow follows the front strand */
      var glowNode = z1 > z2 ? d.nodes1[i] : d.nodes2[i];
      d.glows[i].setAttribute('cx', glowNode.getAttribute('cx'));
      d.glows[i].setAttribute('cy', y);
      d.glows[i].setAttribute('opacity', (0.06 + clamp01(Math.max(z1, z2)) * 0.18).toFixed(2));
    }
    d.path1.setAttribute('d', p1);
    d.path2.setAttribute('d', p2);
  }

  /* ── 5. BAR CHART GENERATION ──────────────────────────── */
  var bars = [];
  var barHeights = [0.65, 0.82, 0.45, 0.93, 0.58, 0.76, 0.42, 0.88];
  var barPhases = [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6];

  function buildBarChart() {
    if (!barChart) return;
    var ns = 'http://www.w3.org/2000/svg';
    barChart.setAttribute('viewBox', '0 0 390 160');

    /* Gradient defs */
    var defs = document.createElementNS(ns, 'defs');
    var grad = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', 'bar-grad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    var s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', CYAN_B);
    var s2 = document.createElementNS(ns, 'stop');
    s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', TEAL);
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);
    barChart.appendChild(defs);

    var barW = 34, gap = 14, startX = 15;
    for (var i = 0; i < 8; i++) {
      var rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', startX + i * (barW + gap));
      rect.setAttribute('width', barW);
      rect.setAttribute('rx', '4');
      rect.setAttribute('fill', 'url(#bar-grad)');
      rect.setAttribute('opacity', '0.85');
      barChart.appendChild(rect);
      bars.push(rect);
    }
  }

  function renderBars(t) {
    for (var i = 0; i < bars.length; i++) {
      var phase = barPhases[i] + t * 0.5;
      var h = barHeights[i] * (0.7 + 0.3 * Math.sin(phase)) * 140;
      bars[i].setAttribute('y', (150 - h).toFixed(1));
      bars[i].setAttribute('height', h.toFixed(1));
      bars[i].setAttribute('opacity', (0.6 + 0.25 * Math.sin(phase + 1)).toFixed(2));
    }
  }

  /* ── 6. MINI SPARKLINE ────────────────────────────────── */
  var sparkPath;

  function buildSparkline() {
    if (!miniChart1) return;
    var ns = 'http://www.w3.org/2000/svg';
    miniChart1.setAttribute('viewBox', '0 0 140 40');
    sparkPath = document.createElementNS(ns, 'polyline');
    sparkPath.setAttribute('fill', 'none');
    sparkPath.setAttribute('stroke', CYAN);
    sparkPath.setAttribute('stroke-width', '1.5');
    sparkPath.setAttribute('stroke-linecap', 'round');
    sparkPath.setAttribute('stroke-linejoin', 'round');
    sparkPath.setAttribute('opacity', '0.7');
    miniChart1.appendChild(sparkPath);
  }

  function renderSparkline(t) {
    if (!sparkPath) return;
    var pts = '';
    for (var i = 0; i < 20; i++) {
      var x = i * 7.3;
      var y = 20 + Math.sin(t * 0.8 + i * 0.6) * 12 + Math.sin(t * 1.3 + i * 0.3) * 5;
      pts += x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    sparkPath.setAttribute('points', pts.trim());
  }

  /* ── 7. NEURAL NETWORK GENERATION ─────────────────────── */
  var nnNodeEls = [], nnConnEls = [];
  var nnLayout = [];

  function buildNeuralNetwork() {
    if (!nnSvg) return;
    var ns = 'http://www.w3.org/2000/svg';

    /* Generate node positions in 3 layers */
    var layers = [
      { count: 5, x: 80 },
      { count: 6, x: 280 },
      { count: 4, x: 480 }
    ];
    var allNodes = [];

    layers.forEach(function (layer) {
      for (var i = 0; i < layer.count; i++) {
        var y = 120 + i * (560 / (layer.count + 1));
        allNodes.push({ x: layer.x, y: y, layer: layers.indexOf(layer) });
      }
    });
    nnLayout = allNodes;

    /* Connections between adjacent layers */
    var layerOffsets = [0, 5, 11];
    for (var l = 0; l < 2; l++) {
      var start = layerOffsets[l], end = layerOffsets[l + 1];
      var endCount = layerOffsets[l + 2] - layerOffsets[l + 1];
      for (var i = start; i < end; i++) {
        for (var j = end; j < end + endCount; j++) {
          var line = document.createElementNS(ns, 'line');
          line.setAttribute('x1', allNodes[i].x);
          line.setAttribute('y1', allNodes[i].y);
          line.setAttribute('x2', allNodes[j].x);
          line.setAttribute('y2', allNodes[j].y);
          line.setAttribute('class', 'nn-connection');
          nnSvg.appendChild(line);
          nnConnEls.push({ el: line, from: i, to: j });
        }
      }
    }

    /* Nodes */
    for (var i = 0; i < allNodes.length; i++) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', allNodes[i].x);
      c.setAttribute('cy', allNodes[i].y);
      c.setAttribute('r', '5');
      c.setAttribute('class', 'nn-node');
      nnSvg.appendChild(c);
      nnNodeEls.push(c);

      /* Inner core */
      var core = document.createElementNS(ns, 'circle');
      core.setAttribute('cx', allNodes[i].x);
      core.setAttribute('cy', allNodes[i].y);
      core.setAttribute('r', '2');
      core.setAttribute('class', 'nn-node-core');
      nnSvg.appendChild(core);
      nnNodeEls.push(core);
    }
  }

  function renderNeuralNetwork(t) {
    /* Pulse nodes in sequence */
    var pulsePhase = t * 1.2;
    for (var i = 0; i < nnLayout.length; i++) {
      var nodePulse = Math.sin(pulsePhase + i * 0.7);
      var opacity = 0.3 + clamp01(nodePulse) * 0.6;
      var radius = 4 + clamp01(nodePulse) * 3;
      if (nnNodeEls[i * 2]) {
        nnNodeEls[i * 2].setAttribute('opacity', opacity.toFixed(2));
        nnNodeEls[i * 2].setAttribute('r', radius.toFixed(1));
      }
    }

    /* Pulse connections */
    for (var i = 0; i < nnConnEls.length; i++) {
      var conn = nnConnEls[i];
      var signal = Math.sin(pulsePhase + conn.from * 0.5 + conn.to * 0.3);
      var opacity = 0.08 + clamp01(signal) * 0.25;
      conn.el.setAttribute('opacity', opacity.toFixed(2));

      /* Occasional bright pulse traveling through */
      var travel = Math.sin(pulsePhase * 0.6 + i * 0.2);
      if (travel > 0.85) {
        conn.el.setAttribute('stroke', CYAN_B);
        conn.el.setAttribute('stroke-width', '1.5');
        conn.el.setAttribute('opacity', '0.6');
      } else {
        conn.el.setAttribute('stroke', '');
        conn.el.setAttribute('stroke-width', '1');
      }
    }
  }

  /* ── 8. FEED ITEMS ────────────────────────────────────── */
  var feedEls = [];

  function buildFeed() {
    if (!feedItems) return;
    var items = [
      { text: 'SEQ-2847 · Gene analysis complete', time: '0.3s', cls: '' },
      { text: 'PCR-1192 · Amplification OK', time: '1.1s', cls: 'dot-ok' },
      { text: 'MRN-0053 · Neural mapping active', time: '2.4s', cls: 'dot-warn' },
      { text: 'CRY-3301 · Protein fold resolved', time: '0.8s', cls: 'dot-ok' },
      { text: 'LBS-7720 · Biosensor calibrated', time: '1.7s', cls: '' }
    ];
    items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML =
        '<div class="fi-dot ' + item.cls + '"></div>' +
        '<span class="fi-text">' + item.text + '</span>' +
        '<span class="fi-time">' + item.time + '</span>';
      feedItems.appendChild(div);
      feedEls.push(div);
    });
  }

  function renderFeed(t) {
    for (var i = 0; i < feedEls.length; i++) {
      var delay = i * 0.4;
      var progress = clamp01((t - delay) * 1.2);
      var opacity = progress;
      var y = (1 - progress) * 12;
      feedEls[i].style.opacity = opacity.toFixed(2);
      feedEls[i].style.transform = 'translateY(' + y.toFixed(1) + 'px)';

      /* Subtle pulse on the dot */
      var dot = feedEls[i].querySelector('.fi-dot');
      if (dot) {
        var pulse = 0.6 + 0.4 * Math.sin(t * 2 + i * 1.3);
        dot.style.boxShadow = '0 0 ' + (4 + pulse * 6).toFixed(0) + 'px ' +
          (dot.classList.contains('dot-ok') ? '#00cc66' :
           dot.classList.contains('dot-warn') ? '#ffaa00' : CYAN);
      }
    }
  }

  /* ── 9. PARTICLE SYSTEM ───────────────────────────────── */
  var particles = [];
  var PARTICLE_COUNT = 90;

  function initParticles() {
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.sin(i * 7.31 + 2.1) * 0.5 + 0.5) * W,
        y: (Math.sin(i * 3.97 + 4.5) * 0.5 + 0.5) * H,
        size: 0.8 + (Math.sin(i * 2.13) * 0.5 + 0.5) * 2.5,
        speed: 8 + (Math.sin(i * 1.71) * 0.5 + 0.5) * 18,
        drift: (Math.sin(i * 5.43) * 0.5 + 0.5) * 12 - 6,
        baseOpacity: 0.15 + (Math.sin(i * 4.27) * 0.5 + 0.5) * 0.45,
        phase: i * 1.37
      });
    }
  }

  function renderParticles(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      /* Deterministic position: base + oscillation + vertical drift (wraps) */
      var x = p.x + Math.sin(t * 0.3 + p.phase) * p.drift;
      var y = (p.y - t * p.speed * 3) % H;
      if (y < -10) y += H + 20;

      var opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(t * 1.5 + p.phase));

      /* Draw particle */
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, PI2);
      ctx.fillStyle = 'rgba(0,178,178,' + opacity.toFixed(3) + ')';
      ctx.fill();

      /* Glow for larger particles */
      if (p.size > 2) {
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, PI2);
        ctx.fillStyle = 'rgba(0,178,178,' + (opacity * 0.12).toFixed(3) + ')';
        ctx.fill();
      }
    }

    /* Occasional bright particle trails */
    for (var i = 0; i < 8; i++) {
      var trailPhase = t * 0.4 + i * 3.7;
      var tx = (Math.sin(trailPhase) * 0.5 + 0.5) * W;
      var ty = (Math.cos(trailPhase * 0.7) * 0.5 + 0.5) * H;
      var to = 0.08 + 0.12 * Math.sin(t * 2 + i);
      ctx.beginPath();
      ctx.arc(tx, ty, 1.5, 0, PI2);
      ctx.fillStyle = 'rgba(0,229,229,' + to.toFixed(3) + ')';
      ctx.fill();
    }
  }

  /* ── 10. MAIN SEEK FUNCTION ───────────────────────────── */
  window.seek = function (t) {
    if (t === undefined) t = 0;
    t = t % DURATION;
    if (t < 0) t += DURATION;

    /* Ambient orbs */
    if (orbs) {
      var orbEls = orbs.querySelectorAll('.orb');
      for (var i = 0; i < orbEls.length; i++) {
        var dx = Math.sin(t * 0.15 + i * 2.1) * 40;
        var dy = Math.cos(t * 0.12 + i * 1.7) * 30;
        var s = 1 + Math.sin(t * 0.2 + i * 1.3) * 0.08;
        orbEls[i].style.transform =
          'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
      }
    }

/* Grid overlay — fade in at start */
if (gridOverlay) {
  gridOverlay.style.opacity = clamp01(t * 0.3).toFixed(2);
}

/* DNA container — fade in over 2s */
var dnaContainer = document.getElementById('dna-container');
if (dnaContainer) {
  dnaContainer.style.opacity = clamp01(t * 0.5).toFixed(3);
}

/* Glass panels — staggered fade in */
var chartPanelEl = document.getElementById('panel-chart');
var metricsPanelEl = document.getElementById('panel-metrics');
var feedPanelEl = document.getElementById('panel-feed');
if (chartPanelEl) chartPanelEl.style.opacity = clamp01((t - 0.8) * 0.8).toFixed(3);
if (metricsPanelEl) metricsPanelEl.style.opacity = clamp01((t - 1.2) * 0.7).toFixed(3);
if (feedPanelEl) feedPanelEl.style.opacity = clamp01((t - 1.8) * 0.6).toFixed(3);

/* DNA helix */
renderDNA(t);

    /* Particles */
    renderParticles(t);

    /* Glass panels floating */
    var panels = document.querySelectorAll('.glass-panel');
    for (var i = 0; i < panels.length; i++) {
      var dx = Math.sin(t * 0.2 + i * 1.5) * 5;
      var dy = Math.cos(t * 0.17 + i * 2.1) * 4;
      panels[i].style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
    }

    /* Sheen sweep on panels */
    for (var i = 0; i < panels.length; i++) {
      var sheenPhase = (t * 0.15 + i * 0.35) % 1;
      var sheenX = -30 + sheenPhase * 160;
      panels[i].style.setProperty('--sheen-x', sheenX.toFixed(0) + '%');
    }

    /* Bar chart */
    renderBars(t);

    /* Metric counter animation */
    if (metric1) {
      var v1 = (72 + Math.sin(t * 0.6) * 8).toFixed(1);
      metric1.textContent = v1 + '%';
    }
    if (metric2) {
      var v2 = Math.floor(1247 + Math.sin(t * 0.4) * 120);
      metric2.textContent = v2.toLocaleString();
    }
    if (metric3) {
      var v3 = (2.4 + Math.sin(t * 0.8) * 0.6).toFixed(1);
      metric3.textContent = v3 + 'ms';
    }

    /* Mini sparkline */
    renderSparkline(t);

    /* Neural network */
    renderNeuralNetwork(t);

    /* Feed items */
    renderFeed(t);

    /* Scan line */
    if (scanLine) {
      var scanY = ((t / DURATION) * (H + 240) - 120);
      scanLine.style.top = scanY.toFixed(1) + 'px';
    }
  };

  /* ── 11. PLAYBACK ENGINE ──────────────────────────────── */
  var isPlaying = false;
  var rafId = null;
  var lastNow = 0;
  var currentTime = 0;

  function syncPlayBtn(playing) {
    if (!playBtn) return;
    playBtn.textContent = playing ? '❚❚' : '▶';
    playBtn.classList.toggle('playing', playing);
  }

  function syncTC(t) {
    if (!tcEl) return;
    var m = Math.floor(t / 60);
    var s = (t % 60).toFixed(1);
    tcEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s +
      ' / 00:' + DURATION.toFixed(0);
  }

  function tick(now) {
    rafId = null;
    var dt = (now - lastNow) / 1000;
    lastNow = now;
    if (isPlaying) {
      currentTime += dt;
      if (currentTime >= DURATION) {
        currentTime = currentTime % DURATION; /* Seamless loop */
      }
      window.seek(currentTime);
      syncTC(currentTime);
      rafId = requestAnimationFrame(tick);
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    lastNow = performance.now();
    syncPlayBtn(isPlaying);
    if (isPlaying && !rafId) rafId = requestAnimationFrame(tick);
  }

  /* ── 12. STAGE SCALING ────────────────────────────────── */
  function fitStage() {
    var vw = window.innerWidth || W;
    var vh = window.innerHeight || H;
    var scale = Math.min(vw / W, vh / H);
    document.documentElement.style.setProperty('--stage-scale', scale);
  }

  /* ── 13. INITIALIZATION ───────────────────────────────── */
  function init() {
    stage = document.getElementById('stage');
    gridOverlay = document.getElementById('grid-overlay');
    orbs = document.getElementById('ambient-orbs');
    dnaGroup = document.getElementById('helix-group');
    canvas = document.getElementById('particles-canvas');
    barChart = document.getElementById('bar-chart');
    metric1 = document.getElementById('metric-1');
    metric2 = document.getElementById('metric-2');
    metric3 = document.getElementById('metric-3');
    miniChart1 = document.getElementById('mini-chart-1');
    feedItems = document.getElementById('feed-items');
    nnSvg = document.getElementById('nn-svg');
    scanLine = document.getElementById('scan-line');
    playBtn = document.getElementById('playbtn');
    tcEl = document.getElementById('tc');

    /* Canvas setup */
    if (canvas) {
      canvas.width = W;
      canvas.height = H;
      ctx = canvas.getContext('2d');
    }

    /* Build procedural elements */
    buildDNA();
    buildBarChart();
    buildSparkline();
    buildNeuralNetwork();
    buildFeed();
    initParticles();

    /* Stage scaling */
    fitStage();
    window.addEventListener('resize', fitStage);

    /* Play/Pause */
    playBtn?.addEventListener('click', togglePlay);
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    });

    /* Auto-play */
    isPlaying = true;
    syncPlayBtn(true);
    lastNow = performance.now();
    rafId = requestAnimationFrame(tick);

    /* Initial frame */
    window.seek(0);
    syncTC(0);
  }

  /* Safe DOM mounting */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
