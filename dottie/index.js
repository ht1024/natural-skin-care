(function () {
  "use strict";

  // --- DOM refs ---
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var startButton = document.getElementById("startButton");
  var pauseButton = document.getElementById("pauseButton");
  var attractScreen = document.getElementById("attractScreen");
  var levelComplete = document.getElementById("levelComplete");
  var startLevel2Button = document.getElementById("startLevel2Button");
  var backToTitleButton = document.getElementById("backToTitleButton");

  // --- View / canvas ---
  var viewWidth = 0;
  var viewHeight = 0;

  // --- Game config ---
  var spawnLineY = 1;
  var baseSpawnRate = 1000;
  var spawnRate = baseSpawnRate;
  var spawnRateOfDescent = 1.0;
  var gameDuration = 33 * 1000;
  var NEON_COLORS = ["#00f0ff", "#ff2bd6", "#ffe600", "#39ff14", "#ffffff"];

  // --- State ---
  var objects = [];
  var popups = [];
  var stars = [];
  var firstID = 0;
  var lastSpawn = -1;
  var score = 0;
  var missed = 0;
  var currentLevel = 1;
  var endTime = 0;
  var pauseRemaining = 0;
  var timerActive = false;
  var stopped = true;
  var paused = false;
  var animating = false;
  var gamePhase = "attract"; // attract | playing | paused | roundEnd

  // --- Audio ---
  var audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type, gainValue) {
    var ac = ensureAudio();
    if (!ac) return;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainValue != null ? gainValue : 0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  }

  function sfxHit(points) {
    // smaller dots (more points) = higher pitch
    var freq = 280 + points * 80;
    playTone(freq, 0.09, "square", 0.07);
  }

  function sfxMiss() {
    playTone(90, 0.18, "sawtooth", 0.06);
  }

  function sfxRoundEnd() {
    playTone(440, 0.1, "square", 0.07);
    setTimeout(function () {
      playTone(554, 0.1, "square", 0.07);
    }, 100);
    setTimeout(function () {
      playTone(659, 0.22, "square", 0.08);
    }, 200);
  }

  // --- Helpers ---
  function formatTime(ms) {
    ms = Math.max(0, Math.floor(ms));
    var seconds = Math.floor(ms / 1000);
    var msecs = ms % 1000;
    function pad(n, len) {
      return String(n).padStart(len, "0");
    }
    return pad(seconds, 2) + ":" + pad(msecs, 3);
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = String(value);
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    viewWidth = rect.width;
    viewHeight = rect.height;
    canvas.width = Math.round(viewWidth * dpr);
    canvas.height = Math.round(viewHeight * dpr);
    if (ctx.resetTransform) {
      ctx.resetTransform();
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    var count = Math.max(40, Math.floor((viewWidth * viewHeight) / 12000));
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * viewWidth,
        y: Math.random() * viewHeight,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawBackground() {
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // faint grid
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
    ctx.lineWidth = 1;
    var step = 40;
    for (var x = 0; x < viewWidth; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, viewHeight);
      ctx.stroke();
    }
    for (var y = 0; y < viewHeight; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(viewWidth, y);
      ctx.stroke();
    }
    ctx.restore();

    // stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      ctx.beginPath();
      ctx.fillStyle = "rgba(200, 230, 255," + s.a + ")";
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Scores ---
  function loadScores() {
    try {
      var hs = Number(localStorage.getItem("dottieMatrix.high")) || 0;
      var hist = JSON.parse(localStorage.getItem("dottieMatrix.history") || "[]");
      setText("highScore", hs);
      var histEl = document.getElementById("scoreHistory");
      if (histEl) {
        histEl.innerHTML = "";
        hist.slice(0, 10).forEach(function (item) {
          var li = document.createElement("li");
          li.textContent = item + " PTS";
          histEl.appendChild(li);
        });
      }
    } catch (e) {
      console.warn("loadScores failed", e);
    }
  }

  function saveScoreEntry(value) {
    if (typeof value !== "number") return;
    var hist = JSON.parse(localStorage.getItem("dottieMatrix.history") || "[]");
    hist.unshift(Math.max(0, Math.round(value)));
    hist = hist.slice(0, 20);
    localStorage.setItem("dottieMatrix.history", JSON.stringify(hist));
    var hs = Number(localStorage.getItem("dottieMatrix.high") || "0");
    if (value > hs) {
      localStorage.setItem("dottieMatrix.high", String(Math.round(value)));
      setText("highScore", Math.round(value));
    }
    loadScores();
  }

  // --- Speed slider ---
  function setupSpeed() {
    var rangeslider = document.getElementById("rangeOfDescent");
    var output = document.getElementById("demo");
    var rangeLabel = document.getElementById("range");
    if (!rangeslider || !output) return;

    function update() {
      var v = Number(rangeslider.value);
      var pxPerSec = 10 + (v - 1) * 15;
      spawnRateOfDescent = pxPerSec / 60;
      output.textContent = pxPerSec + " px/s";
      if (rangeLabel) rangeLabel.textContent = String(v);
    }

    rangeslider.addEventListener("input", update);
    update();
  }

  function applyLevelDifficulty(level) {
    // Level 2+: faster spawn; slight descent bump on top of slider
    spawnRate = Math.max(400, baseSpawnRate - (level - 1) * 180);
  }

  // --- UI phase ---
  function showAttract() {
    gamePhase = "attract";
    stopped = true;
    paused = false;
    timerActive = false;
    animating = false;
    if (attractScreen) attractScreen.hidden = false;
    if (levelComplete) levelComplete.hidden = true;
    if (pauseButton) pauseButton.hidden = true;
    drawBackground();
  }

  function showPlayingUI() {
    if (attractScreen) attractScreen.hidden = true;
    if (levelComplete) levelComplete.hidden = true;
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = "PAUSE";
    }
  }

  function showRoundEnd() {
    gamePhase = "roundEnd";
    stopped = true;
    paused = false;
    timerActive = false;
    if (pauseButton) pauseButton.hidden = true;
    setText("roundScore", Math.round(score));
    var title = document.getElementById("levelCompleteTitle");
    if (title) {
      title.textContent = "STAGE " + currentLevel + " CLEAR";
    }
    if (startLevel2Button) {
      startLevel2Button.textContent = "STAGE " + (currentLevel + 1);
    }
    loadScores();
    if (levelComplete) levelComplete.hidden = false;
    sfxRoundEnd();
  }

  // --- Game control ---
  function startGame(level) {
    ensureAudio();
    currentLevel = level || 1;
    applyLevelDifficulty(currentLevel);
    objects = [];
    popups = [];
    firstID = 0;
    lastSpawn = -1;
    score = 0;
    missed = 0;
    stopped = false;
    paused = false;
    pauseRemaining = 0;
    gamePhase = "playing";
    setText("playerPoints", score);
    setText("missedCount", missed);
    endTime = Date.now() + gameDuration;
    timerActive = true;
    setText("countdownDisplay", formatTime(gameDuration));
    showPlayingUI();
    if (!animating) {
      animating = true;
      animate();
    }
  }

  function togglePause() {
    if (gamePhase !== "playing" && gamePhase !== "paused") return;
    if (!paused) {
      paused = true;
      gamePhase = "paused";
      pauseRemaining = Math.max(0, endTime - Date.now());
      timerActive = false;
      if (pauseButton) pauseButton.textContent = "RESUME";
    } else {
      paused = false;
      gamePhase = "playing";
      endTime = Date.now() + pauseRemaining;
      timerActive = true;
      if (pauseButton) pauseButton.textContent = "PAUSE";
      if (!animating) {
        animating = true;
        animate();
      }
    }
  }

  // --- Spawn / hit / miss ---
  function spawnRandomObject() {
    var diameter = Math.floor(Math.random() * 91) + 10; // 10–100
    var radius = diameter / 2;
    var object = {
      type: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      x: Math.random() * (viewWidth - diameter) + radius,
      y: spawnLineY,
      diameter: diameter,
      objID: firstID++,
      points: Math.round(1 + (100 - diameter) / 10)
    };
    objects.push(object);
  }

  function addPopup(x, y, points) {
    popups.push({
      x: x,
      y: y,
      text: "+" + points,
      life: 1,
      color: "#ffe600"
    });
  }

  function updateScoreUI() {
    setText("playerPoints", Math.max(0, Math.round(score)));
  }

  function handleHit(element, index) {
    score += element.points || 0;
    lastPoints = element.points || 0;
    updateScoreUI();
    addPopup(element.x, element.y, element.points || 0);
    sfxHit(element.points || 1);
    objects.splice(index, 1);
  }

  var lastPoints = 0;

  canvas.addEventListener("click", function (event) {
    if (gamePhase !== "playing" || paused) return;
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    for (var i = objects.length - 1; i >= 0; i--) {
      var element = objects[i];
      var dx = x - element.x;
      var dy = y - element.y;
      var r = element.diameter / 2;
      if (dx * dx + dy * dy <= r * r) {
        handleHit(element, i);
        break;
      }
    }
  });

  // --- Animate ---
  function animate() {
    if (stopped && gamePhase !== "paused") {
      animating = false;
      return;
    }

    var time = Date.now();

    if (paused) {
      drawFrame(true);
      requestAnimationFrame(animate);
      return;
    }

    if (timerActive) {
      var remaining = endTime - time;
      if (remaining <= 0) {
        remaining = 0;
        timerActive = false;
        stopped = true;
        setText("countdownDisplay", formatTime(0));
        try {
          saveScoreEntry(score);
        } catch (e) {
          console.warn(e);
        }
        drawFrame(false);
        showRoundEnd();
        animating = false;
        return;
      }
      setText("countdownDisplay", formatTime(remaining));
    }

    if (time > lastSpawn + spawnRate) {
      lastSpawn = time;
      spawnRandomObject();
    }

    // move objects + miss detection
    var descent = spawnRateOfDescent * (1 + (currentLevel - 1) * 0.15);
    for (var i = objects.length - 1; i >= 0; i--) {
      var object = objects[i];
      object.y += descent;
      if (object.y - object.diameter / 2 > viewHeight) {
        objects.splice(i, 1);
        missed += 1;
        score = Math.max(0, score - 1);
        setText("missedCount", missed);
        updateScoreUI();
        sfxMiss();
      }
    }

    // popups
    for (var p = popups.length - 1; p >= 0; p--) {
      popups[p].y -= 0.8;
      popups[p].life -= 0.02;
      if (popups[p].life <= 0) popups.splice(p, 1);
    }

    drawFrame(false);
    requestAnimationFrame(animate);
  }

  function drawFrame(isPaused) {
    drawBackground();

    // spawn line
    ctx.save();
    ctx.strokeStyle = "rgba(255, 43, 214, 0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, spawnLineY);
    ctx.lineTo(viewWidth, spawnLineY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // dots
    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var r = object.diameter / 2;
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = object.type;
      ctx.beginPath();
      ctx.arc(object.x, object.y, r, 0, Math.PI * 2);
      ctx.fillStyle = object.type;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.restore();
    }

    // score popups
    for (var j = 0; j < popups.length; j++) {
      var pop = popups[j];
      ctx.save();
      ctx.globalAlpha = Math.max(0, pop.life);
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillStyle = pop.color;
      ctx.textAlign = "center";
      ctx.shadowBlur = 8;
      ctx.shadowColor = pop.color;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }

    if (isPaused) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, viewWidth, viewHeight);
      ctx.font = '18px "Press Start 2P", monospace';
      ctx.fillStyle = "#ffe600";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ffe600";
      ctx.fillText("PAUSED", viewWidth / 2, viewHeight / 2);
      ctx.restore();
    }
  }

  // --- Wire events ---
  function init() {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    setupSpeed();
    loadScores();
    showAttract();

    if (startButton) {
      startButton.addEventListener("click", function () {
        startGame(1);
      });
    }
    if (pauseButton) {
      pauseButton.addEventListener("click", togglePause);
    }
    if (startLevel2Button) {
      startLevel2Button.addEventListener("click", function () {
        startGame(currentLevel + 1);
      });
    }
    if (backToTitleButton) {
      backToTitleButton.addEventListener("click", function () {
        showAttract();
        drawBackground();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
