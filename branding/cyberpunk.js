(function () {
  "use strict";

  var path = window.location.pathname;

  function pageType() {
    if (path === "/" || path === "") return "home";
    if (path.indexOf("/login") !== -1 || path.indexOf("/register") !== -1) return "auth";
    if (path.indexOf("/challenges") !== -1) return "challenges";
    if (path.indexOf("/scoreboard") !== -1) return "scoreboard";
    return "default";
  }

  function setPageClass() {
    document.body.classList.add("cp-page-" + pageType());
  }

  function addFrameCorners() {
    document.querySelectorAll(".cp2077-frame").forEach(function (el) {
      if (el.querySelector(".cp2077-corner-br")) return;
      var br = document.createElement("span");
      br.className = "cp2077-corner-br";
      var bl = document.createElement("span");
      bl.className = "cp2077-corner-bl";
      el.appendChild(br);
      el.appendChild(bl);
    });
  }

  function createLoader() {
    if (sessionStorage.getItem("cp-loaded")) return;

    var loader = document.createElement("div");
    loader.id = "cp-loader";
    loader.innerHTML =
      '<div class="cp2077-frame cp-loader-panel">' +
      '<span class="cp2077-corner-br"></span><span class="cp2077-corner-bl"></span>' +
      '<img class="cp-loader-icon" src="/themes/core/static/cyberpunk/icons/thinking.png" alt="" />' +
      '<div class="cp-loader-title">CYBERNOMADS</div>' +
      '<div class="cp-loader-sub">NEO INTERFACE v2.077</div>' +
      '<div class="cp-loader-bar"><div class="cp-loader-bar-fill"></div></div>' +
      '<div class="cp-loader-status">SYNCING NEURAL LINK</div>' +
      "</div>";
    document.body.prepend(loader);

    setTimeout(function () {
      loader.classList.add("cp-loader-hidden");
      sessionStorage.setItem("cp-loaded", "1");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }, 1700);
  }

  function createScanlines() {
    var el = document.createElement("div");
    el.className = "cp-scanlines";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }

  function initParticles() {
    var type = pageType();
    if (type === "default" || type === "home") return;

    var canvas = document.createElement("canvas");
    canvas.id = "cp-particles";
    document.body.prepend(canvas);
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = type === "challenges" ? 45 : 25;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.size = Math.random() * 1.5 + 0.5;
      this.isRed = Math.random() > 0.6;
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isRed
        ? "rgba(255,0,60,0.5)"
        : "rgba(0,240,255,0.4)";
      ctx.fill();
    };

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) particles.push(new Particle());
    }

    function connect() {
      if (type !== "challenges") return;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              "rgba(255,0,60," + (0.06 * (1 - dist / 100)) + ")";
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener("resize", init);
  }

  function animateChallenges() {
    if (pageType() !== "challenges") return;

    function staggerButtons() {
      var buttons = document.querySelectorAll(
        ".challenge-button:not(.cp-animated)"
      );
      buttons.forEach(function (btn, i) {
        btn.classList.add("cp-animated");
        btn.style.animationDelay = i * 0.07 + "s";
      });
    }

    staggerButtons();
    var board = document.getElementById("challenges-board");
    if (board) {
      new MutationObserver(staggerButtons).observe(board, {
        childList: true,
        subtree: true,
      });
    }
  }

  function wrapAuthPanel() {
    if (pageType() !== "auth") return;
    var container = document.querySelector("main .container");
    if (!container || container.classList.contains("cp2077-wrapped")) return;
    container.classList.add("cp2077-frame", "cp2077-wrapped");
    addFrameCorners();
  }

  function init() {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-bs-theme", "dark");
    setPageClass();
    createScanlines();
    createLoader();
    addFrameCorners();
    initParticles();
    animateChallenges();
    wrapAuthPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
