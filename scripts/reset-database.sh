#!/bin/bash
# Fix: Can't create database 'ctfd' (errno: 2) — broken or unreadable data/mysql
set -e
cd "$(dirname "$0")/.."

echo "=== Cybernomads: reset MariaDB data directory ==="
echo "This DELETES the CTF database (challenges, users, scores)."
echo "Uploads in data/uploads are kept."
echo ""
read -r -p "Continue? [y/N] " ans
[[ "$ans" =~ ^[Yy]$ ]] || { echo "Cancelled."; exit 0; }

docker compose down

mkdir -p data/mysql data/uploads data/logs data/redis

# MariaDB image runs as mysql (uid 999)
if command -v sudo >/dev/null 2>&1; then
  sudo rm -rf data/mysql/*
  sudo chown -R 999:999 data/mysql
  sudo chmod 700 data/mysql
  sudo chown -R 1001:1001 data/uploads data/logs 2>/dev/null || true
else
  rm -rf data/mysql/*
  chown -R 999:999 data/mysql 2>/dev/null || true
  chmod 700 data/mysql
fi

echo "Starting MariaDB..."
docker compose up -d db cache

echo "Waiting for MariaDB (up to 60s)..."
for i in $(seq 1 30); do
  if docker compose exec -T db healthcheck.sh --connect --innodb_initialized 2>/dev/null; then
    echo "MariaDB ready."
    break
  fi
  sleep 2
done

echo "Starting CTFd..."
docker compose up -d

echo ""
echo "Done. Open http://localhost:8000/setup (first time) or /login"
echo "Then: python3 scripts/apply-branding.py"
