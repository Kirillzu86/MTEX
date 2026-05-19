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

## Локальный запуск через Docker

1. Создайте `.env` из примера:

```bash
copy .env.example .env
```

2. Поменяйте `DJANGO_SECRET_KEY` в `.env`.

3. Соберите и запустите проект:

```bash
docker compose up --build
```

4. Создайте администратора:

```bash
docker compose exec backend python manage.py createsuperuser
```

Docker-адреса по умолчанию:

- клиентский сайт: `http://localhost:5173/`
- админский сайт: `http://localhost:5174/`
- backend/API: `http://localhost:8000/api/`

SQLite база и медиафайлы лежат в Docker volume `backend-data`.

## Деплой в Coolify

Проект подготовлен для деплоя как Docker Compose приложение. Основной файл: `docker-compose.yml`.

В Coolify:

1. Создайте новый ресурс `Docker Compose`.
2. Подключите репозиторий с проектом.
3. Укажите compose-файл: `docker-compose.yml`.
4. Добавьте переменные окружения.
5. Назначьте домены сервисам:
   - `frontend`, порт `80` - публичный клиентский сайт.
   - `admin-frontend`, порт `80` - админский сайт.
   - `backend`, порт `8000` - публичный API/Django admin.

Пример production-переменных:

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=replace-with-long-random-secret
DJANGO_ALLOWED_HOSTS=api.example.com
DJANGO_CORS_ALLOWED_ORIGINS=https://example.com,https://admin.example.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://api.example.com
DJANGO_SERVE_MEDIA=True
DJANGO_USE_X_FORWARDED_HOST=True
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True

FRONTEND_VITE_API_URL=https://api.example.com/api
ADMIN_VITE_API_URL=https://api.example.com/api
```

Важно: `FRONTEND_VITE_API_URL` и `ADMIN_VITE_API_URL` встраиваются во фронтенды во время сборки. Если меняете домен API, пересоберите сервисы фронтенда.

После первого деплоя создайте администратора через терминал Coolify в контейнере `backend`:

```bash
python manage.py createsuperuser
```

Опционально можно заполнить демо-данные:

```bash
python manage.py seed_demo
```

## Docker-состав

- `backend/Dockerfile` - Django + Gunicorn, миграции и `collectstatic` при старте.
- `frontend/Dockerfile` - сборка Vite и раздача через nginx.
- `admin-frontend/Dockerfile` - сборка админского Vite-сайта и раздача через nginx.
- `docker-compose.yml` - объединяет все сервисы и volume для данных backend.
