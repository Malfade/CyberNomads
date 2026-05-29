# [49] Анализ событий Веб-сервера

**Категория:** Web-Server  
**Очки:** 10  
**Статус в дампе:** visible

## Описание

Скачайте файл Web_Server_Logs03.txt, проанализируйте его содержимое и найдите HTTP-запрос, который содержит признаки XSS-атаки (Cross-Site Scripting).

Формат ответа: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

## Флаг (из дампа CTFd)

- `static`: `"GET /?<script>document.cookie=%22test=3787;%22</script> HTTP/1.1"`

## Вложения

- `Web_Server_Logs03.txt` (CTFd: `data/uploads/4ebdae4fb33ccbe42fbc3376d3efbcff/Web_Server_Logs03.txt`)
