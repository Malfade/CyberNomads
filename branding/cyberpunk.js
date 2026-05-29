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
      '<div class="cp-loader-title cp-signal-glitch" data-text="CYBERNOMADS">CYBERNOMADS</div>' +
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

  function fixChallengeModal() {
    if (pageType() !== "challenges") return;

    function syncModalState() {
      var open = document.querySelector(".modal.show");
      document.body.classList.toggle("cp-modal-open", !!open);
    }

    document.addEventListener("show.bs.modal", syncModalState);
    document.addEventListener("hidden.bs.modal", syncModalState);

    new MutationObserver(syncModalState).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("cp-modal-open")) {
        var modal = document.querySelector(".modal.show");
        if (modal && window.bootstrap && bootstrap.Modal) {
          var inst = bootstrap.Modal.getInstance(modal);
          if (inst) inst.hide();
        }
      }
    });
  }

  function animateChallenges() {
    if (pageType() !== "challenges") return;

    function staggerButtons() {
      var buttons = document.querySelectorAll(
        "#challenges-board .challenge-button:not(.cp-animated)"
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
    var container = document.querySelector("main > .container");
    if (!container || container.classList.contains("cp2077-wrapped")) return;
    if (!container.querySelector("form")) return;

    var jumbotron = document.querySelector("main .jumbotron");
    var titleEl = jumbotron ? jumbotron.querySelector("h1") : null;
    var titleText = titleEl ? titleEl.textContent.trim() : "ACCESS";

    container.classList.add("cp2077-frame", "cp2077-wrapped", "cp-auth-panel");

    var header = document.createElement("div");
    header.className = "cp-auth-header";
    header.innerHTML =
      '<div class="cp-auth-label">ACCESS NODE // AUTH</div>' +
      '<h2 class="cp-auth-title">' + titleText + "</h2>";
    container.insertBefore(header, container.firstChild);

    if (jumbotron) jumbotron.style.display = "none";

    container.querySelectorAll("[class*='offset-']").forEach(function (el) {
      el.className = el.className.replace(/\boffset-\S+/g, "").replace(/\s+/g, " ").trim();
    });

    var innerCol = container.querySelector(".row > [class*='col-']");
    if (innerCol) innerCol.className = "col-12 cp-auth-form-col";

    var form = container.querySelector("form");
    if (!form) {
      addFrameCorners();
      return;
    }

    form.classList.add("cp-auth-form");
    var submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) {
      addFrameCorners();
      return;
    }

    submitBtn.classList.add("cp-auth-submit");
    var submitRow = submitBtn.closest(".row");
    if (!submitRow) {
      addFrameCorners();
      return;
    }

    var forgotLink = submitRow.querySelector("a");
    var actions = document.createElement("div");
    actions.className = "cp-auth-actions";

    var btnWrap = document.createElement("div");
    btnWrap.className = "cp-auth-btn-wrap";
    btnWrap.appendChild(submitBtn);
    actions.appendChild(btnWrap);

    if (forgotLink) {
      var linkWrap = document.createElement("div");
      linkWrap.className = "cp-auth-link-wrap";
      linkWrap.appendChild(forgotLink);
      actions.appendChild(linkWrap);
    }

    submitRow.innerHTML = "";
    submitRow.className = "cp-auth-actions-row";
    submitRow.appendChild(actions);

    addFrameCorners();
  }

  function initSignalGlitch() {
    var targets = document.querySelectorAll(".cp-signal-glitch");
    if (!targets.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function burst() {
      targets.forEach(function (el) {
        el.classList.add("cp-signal-burst");
        setTimeout(function () {
          el.classList.remove("cp-signal-burst");
        }, 180 + Math.random() * 280);
      });
      setTimeout(burst, 1200 + Math.random() * 3500);
    }

    setTimeout(burst, 1500);
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
    fixChallengeModal();
    wrapAuthPanel();
    initSignalGlitch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
