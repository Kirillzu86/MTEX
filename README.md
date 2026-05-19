# MTEX Furniture Store

Проект мебельного магазина:

- `frontend/` - клиентский сайт на React + TypeScript + Vite.
- `admin-frontend/` - отдельный админский сайт на React + TypeScript + Vite.
- `backend/` - Django API, SQLite БД, Django admin и API для каталога/заявок.

## Локальный запуск без Docker

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

Клиентский сайт:

```bash
cd frontend
npm install
npm run dev
```

Админский сайт:

```bash
cd admin-frontend
npm install
npm run dev
```

Локальные адреса:

- клиентский сайт: `http://127.0.0.1:5173/`
- админский сайт: `http://127.0.0.1:5174/`
- Django API: `http://127.0.0.1:8000/api/`
- Django admin: `http://127.0.0.1:8000/admin/`

## Деплой в Coolify отдельными ресурсами

Деплоим 3 отдельных ресурса, каждый из своей папки:

- `backend` - Dockerfile: `backend/Dockerfile`, порт `8000`.
- `frontend` - Dockerfile: `frontend/Dockerfile`, порт `80`.
- `admin-frontend` - Dockerfile: `admin-frontend/Dockerfile`, порт `80`.

Пример доменов:

- `https://mtex.example.com` - клиентский сайт.
- `https://admin.mtex.example.com` - админский сайт.
- `https://api.mtex.example.com` - backend/API/Django admin.

### 1. Backend ресурс

В Coolify создайте новый ресурс из репозитория.

Настройки:

- Build Pack: `Dockerfile`
- Base Directory / Root Directory: `backend`
- Dockerfile: `Dockerfile`
- Port: `8000`
- Domain: `https://api.mtex.example.com`

Environment Variables:

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=replace-with-long-random-secret
DJANGO_ALLOWED_HOSTS=api.mtex.example.com
DJANGO_CORS_ALLOWED_ORIGINS=https://mtex.example.com,https://admin.mtex.example.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://api.mtex.example.com
DJANGO_DB_PATH=/data/db.sqlite3
DJANGO_MEDIA_ROOT=/data/media
DJANGO_SERVE_MEDIA=True
DJANGO_USE_X_FORWARDED_HOST=True
DJANGO_SECURE_SSL_REDIRECT=False
DJANGO_SECURE_HSTS_SECONDS=0
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
```

Добавьте Persistent Storage / Volume:

```text
/data
```

Это нужно, чтобы SQLite база и загруженные медиафайлы не пропадали после redeploy.

После первого деплоя откройте терминал backend-контейнера и создайте администратора:

```bash
python manage.py createsuperuser
```

Опционально можно заполнить демо-данные:

```bash
python manage.py seed_demo
```

### 2. Frontend ресурс

Создайте второй ресурс из того же репозитория.

Настройки:

- Build Pack: `Dockerfile`
- Base Directory / Root Directory: `frontend`
- Dockerfile: `Dockerfile`
- Port: `80`
- Domain: `https://mtex.example.com`

Build Arguments или Environment Variables на этапе сборки:

```env
VITE_API_URL=https://api.mtex.example.com/api
```

Важно: `VITE_API_URL` встраивается во фронтенд во время сборки. Если поменяли API-домен, пересоберите frontend.

### 3. Admin Frontend ресурс

Создайте третий ресурс из того же репозитория.

Настройки:

- Build Pack: `Dockerfile`
- Base Directory / Root Directory: `admin-frontend`
- Dockerfile: `Dockerfile`
- Port: `80`
- Domain: `https://admin.mtex.example.com`

Build Arguments или Environment Variables на этапе сборки:

```env
VITE_API_URL=https://api.mtex.example.com/api
```

Для входа используйте Django superuser или staff-пользователя.

## Что делает backend-контейнер

При старте backend автоматически выполняет:

```bash
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

После этого запускается:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

## Docker-файлы

- `backend/Dockerfile` - Django + Gunicorn.
- `frontend/Dockerfile` - Vite build + nginx.
- `admin-frontend/Dockerfile` - Vite build + nginx.

Каждый Dockerfile рассчитан на сборку из своей папки, поэтому в Coolify обязательно указывайте правильный Base Directory.

