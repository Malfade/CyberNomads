#!/bin/bash
# CTFd container runs as uid 1001 — uploads/logs must be writable
set -e
cd "$(dirname "$0")/.."

mkdir -p data/uploads data/logs data/mysql data/redis

if command -v sudo >/dev/null 2>&1; then
  sudo chown -R 999:999 data/mysql
  sudo chmod 700 data/mysql
  sudo chown -R 1001:1001 data/uploads data/logs
  sudo chmod -R 775 data/uploads data/logs
else
  chown -R 999:999 data/mysql 2>/dev/null || true
  chmod 700 data/mysql
  chown -R 1001:1001 data/uploads data/logs 2>/dev/null || true
  chmod -R 775 data/uploads data/logs
fi

echo "Permissions fixed: data/mysql (999), data/uploads & data/logs (1001)"
