# Cybernomads CTF

Платформа Capture The Flag на базе [CTFd](https://ctfd.io/) с кастомной темой в стиле Cyberpunk 2077.

## Требования

- Docker
- Docker Compose (v2+)
- Python 3 + `requests` (для скрипта брендинга)

```bash
pip install requests
```

## Быстрый запуск

```bash
cd ~/CyberNomads   # или путь к проекту

# 1. Поднять CTFd, MariaDB и Redis
docker compose up -d

# 2. Дождаться готовности и применить тему
python3 scripts/apply-branding.py
```

> **Важно:** `apply-branding.py` работает только когда CTFd уже запущен.
> После `docker compose down` сначала снова выполните `docker compose up -d`.

Скрипт сам ждёт готовности CTFd до **120 секунд** (включая `Connection reset`).
Если не успел — проверьте логи: `docker compose logs -f ctfd`

```bash
# при медленном сервере можно увеличить ожидание
CTFD_WAIT=180 python3 scripts/apply-branding.py
```

Откройте в браузере: **http://localhost:8000**

## Первый запуск vs повторный

| Ситуация | Что делать |
|---|---|
| **Первый запуск** (папка `data/` пустая) | После `docker compose up -d` откройте http://localhost:8000/setup и создайте админа **или** сразу запустите `apply-branding.py` — скрипт сам пройдёт setup, если он ещё не выполнен |
| **Повторный запуск** | Достаточно `docker compose up -d`. Данные сохраняются в `data/` |

## Доступ

| | |
|---|---|
| **Сайт** | http://localhost:8000 |
| **Админ-панель** | http://localhost:8000/admin |
| **Email** | `admin@skysoc.local` |
| **Пароль** | `SkySOC2026!` |

> Смените пароль после первого входа: **Admin → Users → ваш аккаунт**.

## Управление

```bash
# Статус контейнеров
docker compose ps

# Логи CTFd
docker compose logs -f ctfd

# Остановить
docker compose down

# Остановить и удалить данные (полный сброс!)
docker compose down
rm -rf data/

# Перезапуск
docker compose restart

# Применить/обновить тему после правок CSS или homepage
python3 scripts/apply-branding.py
```

## Структура проекта

```
60297002/
├── docker-compose.yml      # CTFd + MariaDB + Redis
├── .env                    # SECRET_KEY для сессий
├── branding/
│   ├── cyberpunk.css       # Стили темы
│   ├── cyberpunk.js        # Анимации (loader, particles)
│   └── assets/cyberpunk/   # Логотип, иконки, фоны (монтируется в контейнер)
├── scripts/
│   └── apply-branding.py   # Настройка темы через API CTFd
├── challenges/             # Задания CTF: вложения + challenge.md (см. challenges/README.md)
│   └── export/ctfd-db/     # JSON-дамп из бэкапа CTFd
└── data/                   # Персистентные данные (не коммитить!)
    ├── mysql/              # База данных
    ├── uploads/            # Загруженные файлы
    ├── redis/
    └── logs/
```

## Кастомизация темы

1. Отредактируйте `branding/cyberpunk.css` и/или `branding/cyberpunk.js`
2. При необходимости измените главную страницу и тексты в `scripts/apply-branding.py` (константы `HOMEPAGE_HTML`, `CTF_NAME` и т.д.)
3. Положите новые статические файлы в `branding/assets/cyberpunk/`
4. Примените изменения:

```bash
python3 scripts/apply-branding.py
```

Чтобы снова увидеть анимацию загрузки в браузере:

```javascript
sessionStorage.removeItem('cp-loaded')
```

## Сервисы в Docker Compose

| Сервис | Образ | Порт |
|---|---|---|
| `ctfd` | `ctfd/ctfd:latest` | 8000 |
| `db` | `mariadb:10.11` | 3306 (внутренний) |
| `cache` | `redis:4` | 6379 (внутренний) |

## Troubleshooting

**CTFd не открывается сразу после старта**  
Подождите 20–30 секунд и проверьте логи: `docker compose logs ctfd`

**`apply-branding.py` падает на homepage / JSONDecodeError**  
CTFd не прошёл setup или неверный логин админа:
```bash
# Откройте в браузере и создайте админа:
# http://YOUR_HOST:8000/setup
# Email: admin@skysoc.local  Password: SkySOC2026!
python3 scripts/apply-branding.py
```
Либо измените `ADMIN_EMAIL` / `ADMIN_PASSWORD` в `scripts/apply-branding.py`.

**`apply-branding.py` падает с Connection refused**  
CTFd не запущен. Выполните:
```bash
docker compose up -d
python3 scripts/apply-branding.py
```
Проверить статус: `docker compose ps`

**Порт 8000 занят** (`Bind for 0.0.0.0:8000 failed`)  
Часто запущены **два** проекта сразу (`60297002` и `CyberNomads`). Оставьте один:

```bash
# кто занял порт
docker ps --format 'table {{.Names}}\t{{.Ports}}' | grep 8000

# остановить старый стек (пример)
cd /home/nundusk/60297002 && docker compose down
# или
cd /home/nundusk/CyberNomads && docker compose down

# затем поднять только нужную папку
cd /home/nundusk/CyberNomads
docker compose up -d
```

Либо другой порт в `docker-compose.yml`: `"8080:8000"` и  
`CTFD_URL=http://localhost:8080 python3 scripts/apply-branding.py`

**`Can't create database 'ctfd' (errno: 2)` в логах**  
Повреждён или недоступен каталог `data/mysql`. На сервере:
```bash
chmod +x scripts/reset-database.sh scripts/fix-permissions.sh
bash scripts/reset-database.sh
# после старта: /setup → создать админа → apply-branding.py
```
Если БД не нужно сбрасывать — только права:
```bash
bash scripts/fix-permissions.sh
docker compose down && docker compose up -d
```

**500 — Internal Server Error**  
Чаще всего битый путь к логотипу в БД или права на `data/uploads`:
```bash
cd ~/CyberNomads   # ваша папка проекта
bash scripts/fix-500.sh
python3 scripts/apply-branding.py
```
Вручную посмотреть причину: `docker compose logs ctfd --tail 80`

**Сброс к чистой установке**  
```bash
docker compose down
rm -rf data/
docker compose up -d
bash scripts/fix-permissions.sh
python3 scripts/apply-branding.py
```

## Лицензия и компоненты

- CTFd — open source, см. [github.com/CTFd/CTFd](https://github.com/CTFd/CTFd)
- Пиксельные иконки — HackerNoon Pixel Icon Library (Community)
