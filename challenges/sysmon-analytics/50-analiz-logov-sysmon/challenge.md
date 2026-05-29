# [50] Анализ логов Sysmon

**Категория:** Sysmon Analytics  
**Очки:** 10  
**Статус в дампе:** visible

## Описание

Скачайте файл Sysmon_Les03.evtx и найдите событие, в котором запускается процесс ftp.exe с параметром скрипта (-s:).
Укажите:
1. Полную командную строку запуска ftp.exe

Формат ответа: xxxxxxxxxxxxxxxxxxxxx

## Флаг (из дампа CTFd)

- `static`: `"C:\Windows\System32\ftp.exe" -s:c:\users\ieuser\appdata\local\temp\ftp.txt`

## Вложения

- `Sysmon_Les03.evtx` (CTFd: `data/uploads/28214f9e789229f49f0240f98b953325/Sysmon_Les03.evtx`)
