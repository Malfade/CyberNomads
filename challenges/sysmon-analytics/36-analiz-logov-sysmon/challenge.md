# [36] Анализ логов Sysmon

**Категория:** Sysmon Analytics  
**Очки:** 10  
**Статус в дампе:** visible

## Описание

Скачайте файл Sysmon_Les01.evtx и найдите в журнале событий команду, которая выполняет дамп паролей из KeePass, а также хеш (MD5) инструмента (KeeFarce), использованного для этого.

Формат ответа: xxxxxxxx - xxxxxxxx xxxx; xxxxxxxxxxxxxxxxxxxxxxxx

## Флаг (из дампа CTFd)

- `static`: `creddump - keefarce HKTL; 07D86CD24E11C1B8F0C2F2029F9D3466`

## Вложения

- `Sysmon_Les01.evtx` (CTFd: `data/uploads/de54a0a48548b406582d7d860ae070bd/Sysmon_Les01.evtx`)
