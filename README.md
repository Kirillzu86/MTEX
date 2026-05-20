# MTEX Furniture Store

Проект состоит из трех отдельных ресурсов для Coolify:

- `backend/` - Django API, SQLite, Django admin.
- `frontend/` - клиентский сайт на React + Vite.
- `admin-frontend/` - админский сайт на React + Vite.

Backend не обязан иметь отдельный публичный домен. Правильная схема для этого проекта:

```text
browser -> frontend domain -> nginx /api -> backend inside Coolify network
browser -> admin domain    -> nginx /api -> backend inside Coolify network
```

То есть браузер видит только домены фронтов, а backend доступен фронтам по внутреннему адресу Coolify.

## Локальный запуск

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Admin frontend:

```bash
cd admin-frontend
npm install
npm run dev
```

Локальные адреса:

- frontend: `http://127.0.0.1:5173/`
- admin frontend: `http://127.0.0.1:5174/`
- backend: `http://127.0.0.1:8001/`

В dev-режиме Vite проксирует `/api` и `/media` на `http://127.0.0.1:8001`.

## Coolify: Backend

Создайте первый ресурс из репозитория.

Настройки:

```text
Build Pack: Dockerfile
Base Directory: backend
Dockerfile: Dockerfile
Port: 8001
Public Domain: не обязательно
```

Если Django admin через `/admin/` публично не нужен, домен backend можно не выдавать.

Environment Variables:

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=replace-with-long-random-secret
DJANGO_ALLOWED_HOSTS=positively-moving-springbuck.cloudpub.ru
DJANGO_CORS_ALLOWED_ORIGINS=https://uniformly-simple-lanternfish.cloudpub.ru,https://timidly-ethical-diver.cloudpub.ru,https://honestly-nifty-jellyfish.cloudpub.ru,https://tiredly-nourishing-pademelon.cloudpub.ru
DJANGO_CSRF_TRUSTED_ORIGINS=https://positively-moving-springbuck.cloudpub.ru,https://uniformly-simple-lanternfish.cloudpub.ru,https://timidly-ethical-diver.cloudpub.ru,https://honestly-nifty-jellyfish.cloudpub.ru,https://tiredly-nourishing-pademelon.cloudpub.ru
DJANGO_DB_PATH=/data/db.sqlite3
DJANGO_MEDIA_ROOT=/data/media
DJANGO_SERVE_MEDIA=True
DJANGO_USE_X_FORWARDED_HOST=True
DJANGO_SECURE_SSL_REDIRECT=False
DJANGO_SECURE_HSTS_SECONDS=0
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
```

Важно: так как фронтовые nginx проксируют backend с заголовком `Host` от своего домена, в `DJANGO_ALLOWED_HOSTS` нужно добавить домены фронтов.

Добавьте persistent storage:

```text
/data
```

После первого деплоя в терминале backend-контейнера:

```bash
python manage.py createsuperuser
```

Опционально:

```bash
python manage.py seed_demo
```

## Coolify: Frontend

Создайте второй ресурс из того же репозитория.

Настройки:

```text
Build Pack: Dockerfile
Base Directory: frontend
Dockerfile: Dockerfile
Port: 81
Domain: https://mtex.example.com
```

Environment Variables:

```env
VITE_API_URL=https://positively-moving-springbuck.cloudpub.ru/api
BACKEND_URL=http://backend:8001
```

`BACKEND_URL` должен быть внутренним адресом backend-ресурса в сети Coolify.

Если ресурс backend в Coolify называется не `backend`, возьмите внутренний URL из настроек Coolify и подставьте его вместо:

```text
http://backend:8001
```

## Coolify: Admin Frontend

Создайте третий ресурс из того же репозитория.

Настройки:

```text
Build Pack: Dockerfile
Base Directory: admin-frontend
Dockerfile: Dockerfile
Port: 82
Domain: https://admin.mtex.example.com
```

Environment Variables:

```env
VITE_API_URL=https://positively-moving-springbuck.cloudpub.ru/api
BACKEND_URL=http://backend:8001
```

Для входа используйте Django superuser или staff-пользователя.

## Что с портами

`Port: 8001` у backend в Coolify - это порт внутри контейнера, на котором слушает Gunicorn.

Это не значит, что backend занимает порт сервера, где работает сам Coolify. Coolify/Traefik проксирует трафик внутрь контейнера. Конфликт будет только если вручную публиковать host port, а здесь это не нужно.

Client frontend слушает порт `81` внутри контейнера, admin frontend слушает порт `82`. Снаружи Coolify сам выдает HTTPS-домены.

## Почему не писать Docker IP во frontend

React-код работает в браузере пользователя. Браузер не находится внутри Docker-сети Coolify и не сможет открыть `http://backend:8001` или внутренний Docker IP.

Поэтому схема такая:

```text
React fetch('/api/categories/')
-> nginx frontend контейнера
-> proxy_pass BACKEND_URL
-> Django backend
```
