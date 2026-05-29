#!/bin/bash
# Fix common CTFd 500 errors (broken ctf_logo / favicon paths, permissions)
set -e
cd "$(dirname "$0")/.."

echo "=== 1. Container status ==="
docker compose ps

echo ""
echo "=== 2. Last CTFd errors ==="
docker compose logs ctfd --tail 40 2>&1 | tail -40

LOGO="branding/assets/cyberpunk/logo-transparent.png"
ICON="branding/assets/cyberpunk/favicon.png"

if [[ ! -f "$LOGO" ]]; then
  LOGO="$ICON"
fi

if [[ ! -f "$LOGO" ]]; then
  echo "ERROR: No logo-transparent.png or favicon.png in branding/assets/cyberpunk/"
  exit 1
fi

echo ""
echo "=== 3. Fix uploads + DB paths ==="
mkdir -p data/uploads data/logs

LOGO_DIGEST=$(md5sum "$LOGO" | awk '{print $1}')
LOGO_DEST="data/uploads/${LOGO_DIGEST}/$(basename "$LOGO")"
mkdir -p "$(dirname "$LOGO_DEST")"
cp -f "$LOGO" "$LOGO_DEST"

SQL_LOGO="UPDATE config SET value='${LOGO_DIGEST}/$(basename "$LOGO")' WHERE \`key\`='ctf_logo';"

if [[ -f "$ICON" ]]; then
  ICON_DIGEST=$(md5sum "$ICON" | awk '{print $1}')
  ICON_DEST="data/uploads/${ICON_DIGEST}/$(basename "$ICON")"
  mkdir -p "$(dirname "$ICON_DEST")"
  cp -f "$ICON" "$ICON_DEST"
  SQL_ICON="UPDATE config SET value='${ICON_DIGEST}/$(basename "$ICON")' WHERE \`key\`='ctf_small_icon';"
else
  SQL_ICON="DELETE FROM config WHERE \`key\`='ctf_small_icon';"
fi

if command -v sudo >/dev/null 2>&1; then
  sudo chown -R 999:999 data/mysql 2>/dev/null || true
  sudo chown -R 1001:1001 data/uploads data/logs
  sudo chmod -R 775 data/uploads data/logs
else
  chown -R 1001:1001 data/uploads data/logs 2>/dev/null || true
fi

if ! docker compose ps db 2>/dev/null | grep -q healthy; then
  echo "DB not healthy — start stack first: docker compose up -d"
  exit 1
fi

docker compose exec -T db mariadb -uctfd -pctfd ctfd -e "$SQL_LOGO" 2>/dev/null || \
docker compose exec -T db mariadb -uctfd -pctfd ctfd -e "$SQL_LOGO"

if [[ -n "$SQL_ICON" ]]; then
  docker compose exec -T db mariadb -uctfd -pctfd ctfd -e "$SQL_ICON" 2>/dev/null || true
fi

echo ""
echo "=== 4. Restart CTFd ==="
docker compose restart ctfd
sleep 15

echo ""
echo "=== 5. HTTP check ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/ || echo "000")
echo "GET / → HTTP $CODE"

if [[ "$CODE" == "200" ]] || [[ "$CODE" == "302" ]]; then
  echo ""
  echo "OK. Open http://YOUR_IP:8000 and run:"
  echo "  python3 scripts/apply-branding.py"
else
  echo ""
  echo "Still failing. Full logs:"
  echo "  docker compose logs ctfd --tail 80"
fi
