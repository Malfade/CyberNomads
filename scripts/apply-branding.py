#!/usr/bin/env python3
"""Apply cyberpunk CTF theme to CTFd."""

import hashlib
import os
import re
import sys
import time
from pathlib import Path

import requests

BASE_URL = os.environ.get("CTFD_URL", "http://localhost:8000")
WAIT_TIMEOUT = int(os.environ.get("CTFD_WAIT", "120"))
WAIT_INTERVAL = 2
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "branding" / "assets" / "cyberpunk"
CSS_FILE = ROOT / "branding" / "cyberpunk.css"
JS_FILE = ROOT / "branding" / "cyberpunk.js"
UPLOADS = ROOT / "data" / "uploads"

CTF_NAME = "Cybernomads"
CTF_DESCRIPTION = "Capture The Flag — Cybernomads"
ADMIN_EMAIL = "admin@skysoc.local"
ADMIN_PASSWORD = "SkySOC2026!"
THEME_COLOR = "#fcee0a"

HOMEPAGE_HTML = """\
<div class="cp2077-shell">
  <div class="cp2077-topbar">
    <div>
      <div class="cp2077-topbar-label">INTERFACE STYLES // CTF</div>
      <h1 class="cp2077-title">CYBERNOMADS</h1>
      <p class="cp2077-subtitle">STYLE OVER SUBSTANCE</p>
    </div>
    <div class="cp2077-topbar-deco">
      <img src="/themes/core/static/cyberpunk/performance.png" alt="Performance" title="Performance" />
      <img src="/themes/core/static/cyberpunk/statistics.png" alt="Statistics" title="Statistics" />
    </div>
  </div>
  <div class="cp2077-grid">
    <aside class="cp2077-frame">
      <span class="cp2077-corner-br"></span><span class="cp2077-corner-bl"></span>
      <div class="cp2077-head">CHANNELS</div>
      <ul class="cp2077-inbox-list">
        <li><a class="cp2077-inbox-item cp2077-inbox-item--active" href="/"><img src="/themes/core/static/cyberpunk/icons/briefing.png" alt="" />BRIEFING</a></li>
        <li><a class="cp2077-inbox-item" href="/challenges"><img src="/themes/core/static/cyberpunk/icons/missions.png" alt="" />MISSIONS</a></li>
        <li><a class="cp2077-inbox-item" href="/scoreboard"><img src="/themes/core/static/cyberpunk/icons/leaderboard.png" alt="" />LEADERBOARD</a></li>
        <li><a class="cp2077-inbox-item" href="/login"><img src="/themes/core/static/cyberpunk/icons/access.png" alt="" />ACCESS NODE</a></li>
      </ul>
    </aside>
    <section class="cp2077-frame">
      <span class="cp2077-corner-br"></span><span class="cp2077-corner-bl"></span>
      <div class="cp2077-head cp2077-head--active">URGENT INFORMATION</div>
      <div class="cp2077-main-body">
        <strong>OPERATOR BRIEFING:</strong> Добро пожаловать в сеть Cybernomads.
        Здесь тебя ждут миссии по взлому, реверсу, криптографии и форензике.
        Каждый захваченный флаг — шаг к вершине рейтинга.
      </div>
      <a href="/challenges" class="cp2077-btn cp2077-btn--primary">INITIALIZE RUN</a>
      <a href="/register" class="cp2077-btn cp2077-btn--ghost">REGISTER ID</a>
    </section>
    <aside class="cp2077-frame">
      <span class="cp2077-corner-br"></span><span class="cp2077-corner-bl"></span>
      <div class="cp2077-head">SYSTEMS</div>
      <div class="cp2077-stat-row">
        <img src="/themes/core/static/cyberpunk/performance.png" alt="" />
        <span>PERFORMANCE // OPTIMAL</span>
      </div>
      <div class="cp2077-stat-row">
        <img src="/themes/core/static/cyberpunk/statistics.png" alt="" />
        <span>ANALYTICS // ONLINE</span>
      </div>
      <div class="cp2077-stat-row">
        <img src="/themes/core/static/cyberpunk/icons/ai.png" alt="" />
        <span>NEURAL NET // ACTIVE</span>
      </div>
      <div class="cp2077-stat-row">
        <img src="/themes/core/static/cyberpunk/icons/data.png" alt="" />
        <span>DATA VAULT // SECURE</span>
      </div>
      <div class="cp2077-label" style="margin-top:0.75rem">SECURITY LEVEL</div>
      <div class="cp2077-levels">
        <div class="cp2077-level">T1</div>
        <div class="cp2077-level cp2077-level--on">T2</div>
        <div class="cp2077-level">T3</div>
        <div class="cp2077-level">T4</div>
      </div>
      <img class="cp2077-skull" src="/themes/core/static/cyberpunk/hood-yellow.png" alt="" />
    </aside>
  </div>
</div>
"""

FOOTER_HTML = """\
<div class="cp-footer"><span>CYBERNOMADS</span> // ARASAKA CONSUMER TECHNOLOGY // NETRUNNER INTERFACE</div>
"""


def extract_nonce(html: str) -> str | None:
    for pattern in (
        r'name="nonce"[^>]*value="([^"]+)"',
        r"csrfNonce': '([^']+)'",
        r'csrfNonce\': "([^"]+)"',
    ):
        match = re.search(pattern, html)
        if match:
            return match.group(1)
    return None


def api_headers(session: requests.Session) -> dict:
    resp = session.get(f"{BASE_URL}/login")
    nonce = extract_nonce(resp.text) or ""
    return {
        "Content-Type": "application/json",
        "CSRF-Token": nonce,
        "Accept": "application/json",
    }


def build_theme_header() -> str:
    css = CSS_FILE.read_text(encoding="utf-8")
    js = JS_FILE.read_text(encoding="utf-8")
    return (
        f'<style id="cp-theme">\n{css}\n</style>\n'
        f'<script id="cp-theme-js">\n{js}\n</script>'
    )


def upload_path_for(filename: str, data: bytes) -> str:
    digest = hashlib.md5(data).hexdigest()
    dest_dir = UPLOADS / digest
    dest_dir.mkdir(parents=True, exist_ok=True)
    (dest_dir / filename).write_bytes(data)
    return f"{digest}/{filename}"


def sync_logos(session: requests.Session) -> None:
    # Navbar logo removed — text-only brand
    patch_config(session, "ctf_logo", "")

    favicon = ASSETS / "favicon.png"
    if favicon.exists():
        patch_config(
            session,
            "ctf_small_icon",
            upload_path_for(favicon.name, favicon.read_bytes()),
        )


def patch_config(session: requests.Session, key: str, value: str) -> None:
    resp = session.patch(
        f"{BASE_URL}/api/v1/configs/{key}",
        json={"value": value},
        headers=api_headers(session),
    )
    if resp.status_code not in (200, 204):
        raise RuntimeError(f"Failed to patch {key}: {resp.status_code} {resp.text}")


def patch_homepage(session: requests.Session) -> None:
    pages = session.get(
        f"{BASE_URL}/api/v1/pages", headers=api_headers(session)
    ).json()
    page_id = next(p["id"] for p in pages["data"] if p["route"] == "index")
    resp = session.patch(
        f"{BASE_URL}/api/v1/pages/{page_id}",
        json={"content": HOMEPAGE_HTML, "title": CTF_NAME},
        headers=api_headers(session),
    )
    if resp.status_code not in (200, 204):
        raise RuntimeError(f"Failed to update homepage: {resp.status_code}")


def ctfd_is_ready() -> bool:
    try:
        resp = requests.get(f"{BASE_URL}/login", timeout=5)
    except requests.RequestException:
        return False

    if resp.status_code >= 500:
        return False

    if extract_nonce(resp.text):
        return True

    return "/setup" in resp.url or "setup" in resp.text.lower()


def wait_for_ctfd(timeout: int = WAIT_TIMEOUT) -> None:
    deadline = time.time() + timeout
    attempt = 0
    printed = False

    while time.time() < deadline:
        attempt += 1
        if ctfd_is_ready():
            if printed:
                print(f"CTFd ready at {BASE_URL} (attempt {attempt})")
            return

        if not printed:
            print(f"Waiting for CTFd at {BASE_URL} (up to {timeout}s)...")
            printed = True

        time.sleep(WAIT_INTERVAL)

    print(
        f"\nCTFd is not ready at {BASE_URL} after {timeout}s\n"
        "Check logs:\n"
        "  docker compose logs -f ctfd\n"
        "Then retry:\n"
        "  python3 scripts/apply-branding.py",
        file=sys.stderr,
    )
    raise SystemExit(1)


def login(session: requests.Session) -> None:
    deadline = time.time() + 30
    last_error: Exception | None = None

    while time.time() < deadline:
        try:
            resp = session.get(f"{BASE_URL}/login", timeout=10)
            nonce = extract_nonce(resp.text)
            if not nonce:
                time.sleep(WAIT_INTERVAL)
                continue

            resp = session.post(
                f"{BASE_URL}/login",
                data={
                    "name": ADMIN_EMAIL,
                    "password": ADMIN_PASSWORD,
                    "nonce": nonce,
                },
                allow_redirects=True,
                timeout=10,
            )
            if "login" in resp.url:
                raise RuntimeError(
                    "Login failed — check ADMIN_EMAIL / ADMIN_PASSWORD in apply-branding.py"
                )
            return
        except RuntimeError:
            raise
        except requests.RequestException as exc:
            last_error = exc
            time.sleep(WAIT_INTERVAL)

    print(
        f"\nCannot connect to {BASE_URL} while logging in\n"
        "Run `docker compose up -d`, wait ~30 sec, then retry.",
        file=sys.stderr,
    )
    if last_error:
        raise SystemExit(1) from last_error
    raise SystemExit(1)


def main() -> int:
    for f in (CSS_FILE, JS_FILE):
        if not f.exists():
            print(f"Missing: {f}", file=sys.stderr)
            return 1

    session = requests.Session()
    wait_for_ctfd()
    print("Logging in...")
    login(session)

    print("Setting logos...")
    sync_logos(session)

    print("Updating homepage...")
    patch_homepage(session)

    print("Applying cyberpunk theme...")
    patch_config(session, "theme_header", build_theme_header())
    patch_config(session, "theme_footer", FOOTER_HTML)
    patch_config(session, "theme_color", THEME_COLOR)
    patch_config(session, "ctf_name", CTF_NAME)
    patch_config(session, "ctf_description", CTF_DESCRIPTION)

    print(f"\nDone! {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
