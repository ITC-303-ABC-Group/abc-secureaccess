# ABC SecureAccess

Simple user login and authentication system with **User** access and an **Admin Dashboard**.

- `frontend/` React + Vite (light blue and white theme, styled after DESIGN-airbnb.md)
- `backend/`  Laravel API + MySQL (XAMPP), token auth with Laravel Sanctum

`backend/` holds only the files that are specific to this project. You drop them into a fresh Laravel app (steps below).

## What you need

- XAMPP with **PHP 8.2 or newer** (check with `php -v`; add `C:\xampp\php` to your PATH)
- [Composer](https://getcomposer.org/download/)
- Node.js 20+

## 1. Database (XAMPP)

1. Open the XAMPP Control Panel and **Start MySQL** (also Apache if you want phpMyAdmin).
2. Open http://localhost/phpmyadmin, click **New**, create a database named `abc_secureaccess` (collation `utf8mb4_unicode_ci`).

## 2. Backend (Laravel)

Run these from the folder that contains `backend/` and `frontend/`:

```bash
composer create-project laravel/laravel api
```

Copy everything inside `backend/` over the new `api/` folder (merge folders, overwrite when asked). That adds the models, controllers, middleware, migrations, seeder and `routes/api.php`.

Then, inside `api/`:

1. Open `.env` and replace the `DB_*` lines with the ones in `backend/env.mysql.txt`.
2. Install the API layer (Sanctum tokens). Answer **no** if it asks to run migrations:
   ```bash
   php artisan install:api
   ```
3. Create the tables and the demo admin:
   ```bash
   php artisan migrate --seed
   ```
4. Start the API:
   ```bash
   php artisan serve
   ```
   It runs at http://127.0.0.1:8000.

## 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (http://localhost:5173). Dev requests to `/api` are forwarded to Laravel automatically.

## Accounts

| Role  | Username | Password |
| ----- | -------- | -------- |
| Admin | `admin`  | `admin123` (change it under My account) |
| User  | register on the login page | min. 8 characters |

## API

| Method | Endpoint | Access |
| ------ | -------- | ------ |
| POST | `/api/register` | public |
| POST | `/api/login` | public (10 attempts per minute) |
| GET | `/api/me` | signed in |
| POST | `/api/logout` | signed in |
| PUT | `/api/password` | signed in |
| GET | `/api/admin/stats` | admin |
| GET | `/api/admin/users` | admin |
| PATCH | `/api/admin/users/{id}/status` | admin |
| DELETE | `/api/admin/users/{id}` | admin |
| GET | `/api/admin/activity` | admin |

## Security notes

- Passwords are hashed with bcrypt by Laravel. Roles are checked on the server (`EnsureAdmin` middleware), not just hidden in the UI.
- `role` and `status` cannot be set from a request; new registrations are always `user`.
- Suspending or deleting a user revokes their tokens right away; changing a password signs out other devices.
- The token is kept in the browser's `localStorage`, which is fine for this project. For a public production site, use HTTPS and consider Sanctum's cookie (SPA) mode.
- Change the seeded `admin123` password before using this anywhere real.
