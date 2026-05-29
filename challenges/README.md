# Карта заданий CTF (дамп 2025-06-23)

Архив: `CTF.2025-06-23_10_17_43.zip`

## Структура

```
challenges/<категория>/<id>-<название>/
  challenge.md    # описание и флаги
  <вложения>      # если есть в дампе
```

Вложения продублированы в `data/uploads/<hash>/` для CTFd.
JSON-дамп БД: `challenges/export/ctfd-db/`.

## Задачи с файлами (18 вложений)

| ID | Категория | Задание | Файл | Папка | CTFd upload |
|---:|---|---|---|---|---|
| 36 | Sysmon Analytics | Анализ логов Sysmon | `Sysmon_Les01.evtx` | `challenges/sysmon-analytics/36-analiz-logov-sysmon/Sysmon_Les01.evtx` | `data/uploads/de54a0a48548b406582d7d860ae070bd/Sysmon_Les01.evtx` |
| 37 | Sysmon Analytics | Анализ логов Sysmon | `Sysmon_Les02.evtx` | `challenges/sysmon-analytics/37-analiz-logov-sysmon/Sysmon_Les02.evtx` | `data/uploads/841640f0eca113891e151761c378a6b3/Sysmon_Les02.evtx` |
| 50 | Sysmon Analytics | Анализ логов Sysmon | `Sysmon_Les03.evtx` | `challenges/sysmon-analytics/50-analiz-logov-sysmon/Sysmon_Les03.evtx` | `data/uploads/28214f9e789229f49f0240f98b953325/Sysmon_Les03.evtx` |
| 46 | Web-Server | Анализ событий Веб-сервера | `Web_Server_Logs01.txt` | `challenges/web-server/46-analiz-sobytiy-veb-servera/Web_Server_Logs01.txt` | `data/uploads/a23be6cb1f8c950aefff8e5545b91855/Web_Server_Logs01.txt` |
| 48 | Web-Server | Анализ событий Веб-сервера | `Web_Server_Logs02.txt` | `challenges/web-server/48-analiz-sobytiy-veb-servera/Web_Server_Logs02.txt` | `data/uploads/4587ccf06b532f736661bf90b8873788/Web_Server_Logs02.txt` |
| 49 | Web-Server | Анализ событий Веб-сервера | `Web_Server_Logs03.txt` | `challenges/web-server/49-analiz-sobytiy-veb-servera/Web_Server_Logs03.txt` | `data/uploads/4ebdae4fb33ccbe42fbc3376d3efbcff/Web_Server_Logs03.txt` |
| 39 | Windows | Анализ событий Windows | `Windows_Logs01.evtx` | `challenges/windows/39-analiz-sobytiy-windows/Windows_Logs01.evtx` | `data/uploads/023f4108fcb930058a0679ea0d299b2b/Windows_Logs01.evtx` |
| 40 | Windows | Анализ событий Windows | `Windows_Logs02.evtx` | `challenges/windows/40-analiz-sobytiy-windows/Windows_Logs02.evtx` | `data/uploads/ce882aee7e9ba390091292f66f9268b1/Windows_Logs02.evtx` |
| 41 | Windows | Анализ событий Windows | `Windows_Logs03.evtx` | `challenges/windows/41-analiz-sobytiy-windows/Windows_Logs03.evtx` | `data/uploads/d9ec623a67a7a1dfd012aa249be31938/Windows_Logs03.evtx` |
| 42 | Windows | Анализ событий Windows | `Windows_Logs04.evtx` | `challenges/windows/42-analiz-sobytiy-windows/Windows_Logs04.evtx` | `data/uploads/78250df0028b4d5943244e6037e173e2/Windows_Logs04.evtx` |
| 43 | Windows | Журналы приложений | `SQL.evtx` | `challenges/windows/43-zhurnaly-prilozheniy/SQL.evtx` | `data/uploads/1e2791b2452e22ede83ba31e5c39bafb/SQL.evtx` |
| 44 | Windows | Анализ событий Windows | `Windows_Logs05.evtx` | `challenges/windows/44-analiz-sobytiy-windows/Windows_Logs05.evtx` | `data/uploads/485bf619102b2b6ed1ccff57de6318f1/Windows_Logs05.evtx` |
| 45 | Windows | Анализ событий Windows | `Windows_Logs06.evtx` | `challenges/windows/45-analiz-sobytiy-windows/Windows_Logs06.evtx` | `data/uploads/2bb1ea9cc82160545a14560f3a43f5ce/Windows_Logs06.evtx` |
| 60 | Windows | Анализ событий Windows | `Windows_Logs07.evtx` | `challenges/windows/60-analiz-sobytiy-windows/Windows_Logs07.evtx` | `data/uploads/8e2cd4041a0b9fd90afaccf8176de9ee/Windows_Logs07.evtx` |
| 61 | Windows | Анализ событий Windows | `Windows_Logs08.evtx` | `challenges/windows/61-analiz-sobytiy-windows/Windows_Logs08.evtx` | `data/uploads/aa59219efd63bf55ed221ac82055f21a/Windows_Logs08.evtx` |
| 9 | Анализ логов | Утечка пароля | `ctf.logs` | `challenges/analiz-logov/09-utechka-parolya/ctf.logs` | `data/uploads/78e84940ab07cfdaeb303ddfcebeb08d/ctf.logs` |
| 2 | Анализ сетевого трафика | Перехват HTTP пакетов | `1.pcapng` | `challenges/analiz-setevogo-trafika/02-perehvat-http-paketov/1.pcapng` | `data/uploads/0a4d0b383ebb604405cd29d28860adb8/1.pcapng` |
| 4 | Анализ сетевого трафика | Перехват Telnet трафика | `2.pcapng` | `challenges/analiz-setevogo-trafika/04-perehvat-telnet-trafika/2.pcapng` | `data/uploads/c796d4957ecb65d629e2eea6e0e4dbf9/2.pcapng` |

## Задачи без файла в архиве

| ID | Категория | Задание | Где брать данные |
|---:|---|---|---|
| 18 | Sysmon Practies | Создание файла | `challenges/sysmon-practies/_lab-materials/` |
| 19 | Sysmon Practies | Изменение файла | `challenges/sysmon-practies/_lab-materials/` |
| 20 | Sysmon Practies | Запуск процесса | `challenges/sysmon-practies/_lab-materials/` |
| 21 | Sysmon Practies | Удаление файла | `challenges/sysmon-practies/_lab-materials/` |
| 51 | Анализ вредоносного ПО | Ip адрес | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 52 | Анализ вредоносного ПО | Ip порт | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 53 | Анализ вредоносного ПО | Протокол | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 54 | Анализ вредоносного ПО | Название вредоносного ПО  | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 55 | Анализ вредоносного ПО | Домен | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 56 | Анализ вредоносного ПО | Логин | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 57 | Анализ вредоносного ПО | Пароль | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 58 | Анализ вредоносного ПО | Процесс | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 59 | Анализ вредоносного ПО | Ip адреса принадлежащие домену | `challenges/analiz-vredonosnogo-po/_external/ANY.RUN.txt` |
| 31 | Атаки | Что означает первая буква D в DDOS? | ответ из теории |
| 32 | Атаки | На каком уровне модели OSI происходят SQL инъекции? | ответ из теории |
| 33 | Атаки | Как называется данная атака? | ответ из теории |
| 34 | Атаки | Как называется данная атака? | ответ из теории |
| 6 | Модель OSI | Сколько уровней в модели OSI? | ответ из теории |
| 7 | Модель OSI | Уровень передачи данных? | ответ из теории |
| 8 | Модель OSI | На каком уровне создаются фреймы(кадры)? | ответ из теории |
| 10 | Модель OSI | На каком уровне происходит взаимодействие с клиентом? | ответ из теории |
| 29 | Модель OSI | На каком уровне работает протокол HTTP? | ответ из теории |
| 30 | Модель OSI | На каком уровне работает протокол ethernet? | ответ из теории |
| 22 | Триада | По оценке Триады КЦД, что более приоритетно для административного пароля? | ответ из теории |
| 23 | Триада | По оценке Триады КЦД, что более приоритетно для вэб-страницы интернет-магазина? | ответ из теории |
| 24 | Триада | По оценке Триады КЦД, что более приоритетно для пакетов обновлений? | ответ из теории |
| 27 | Триада | Что из трех понятий наиболее относится к Целостности информации? | ответ из теории |
| 28 | Триада | Что из трех понятий наиболее относится к Конфиденциальности информации? | ответ из теории |

## Сводка по категориям

| Категория | Задач | С файлами |
|---|---:|---:|
| Sysmon Analytics | 3 | 3 |
| Sysmon Practies | 4 | 0 |
| Web-Server | 3 | 3 |
| Windows | 9 | 9 |
| Анализ вредоносного ПО | 9 | 0 |
| Анализ логов | 1 | 1 |
| Анализ сетевого трафика | 2 | 2 |
| Атаки | 4 | 0 |
| Модель OSI | 6 | 0 |
| Триада | 5 | 0 |

## Прочие файлы из архива (не челленджи)

| Файл | Назначение |
|---|---|
| `db/*.json` | дамп CTFd → `challenges/export/ctfd-db/` |
| `uploads/*/Screenshot*.png` | оформление страниц |
| `uploads/*/skysoc_kyrgyzstan_qr_6.png` | QR на странице |