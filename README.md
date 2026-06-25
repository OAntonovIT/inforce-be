# NestJS Books API

A production-ready REST API built with NestJS, featuring JWT authentication with refresh tokens, role-based access control (RBAC), rate limiting, Swagger documentation, and Prisma ORM with PostgreSQL.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| NestJS | v11 | Framework |
| Prisma | v6 | ORM |
| PostgreSQL (Neon) | — | Database |
| JWT (access + refresh) | — | Authentication |
| Passport.js | — | Auth strategies |
| Helmet | — | HTTP security headers |
| @nestjs/throttler | — | Rate limiting |
| @nestjs/swagger | — | API documentation |
| class-validator | — | Input validation |
| bcrypt | — | Password hashing |

---

## Roles & Permissions

| Endpoint | User | Admin |
|---|---|---|
| `GET /books` | ✅ | ✅ |
| `GET /books/:id` | ✅ | ✅ |
| `POST /books` | ❌ | ✅ |
| `PATCH /books/:id` | ❌ | ✅ |
| `DELETE /books/:id` | ❌ | ✅ |
| `GET /users` | ❌ | ✅ |
| `POST /users` | ❌ | ✅ |
| `PATCH /users/:id` | ❌ | ✅ |
| `DELETE /users/:id` | ❌ | ✅ |

---

## Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values (see [Environment Variables](#environment-variables)).

### 3. Generate Prisma client and apply migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Start the server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens (min 32 chars, random) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (min 32 chars, random) |
| `PORT` | — | Server port (default: `3000`) |
| `CORS_ORIGINS` | — | Comma-separated allowed origins (default: `http://localhost:5173,http://localhost:3000`) |

Generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/api/docs
```

---

## API Endpoints

### Auth

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login, receive tokens |
| `POST` | `/auth/refresh` | Public | Get new access token |

**Rate limits:** `/auth/signup` and `/auth/login` — 5 requests/min; `/auth/refresh` — 10 requests/min.

**Token lifetimes:** Access token — 15 minutes; Refresh token — 4 hours.

### Books

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/books` | Public | Paginated list with search |
| `GET` | `/books/:id` | Public | Get single book |
| `POST` | `/books` | Admin | Create book |
| `PATCH` | `/books/:id` | Admin | Update book |
| `DELETE` | `/books/:id` | Admin | Delete book |

### Users

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | Paginated list with search |
| `GET` | `/users/:id` | Admin | Get single user |
| `POST` | `/users` | Admin | Create user |
| `PATCH` | `/users/:id` | Admin | Update user |
| `DELETE` | `/users/:id` | Admin | Delete user |

### Health

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health check |

---

## Pagination & Search

All list endpoints support:

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number (min: 1) |
| `limit` | `10` | Items per page (min: 1) |
| `search` | — | Case-insensitive search |

**Response shape:**
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

## Error Response Shape

All errors follow a consistent structure:

```json
{
  "success": false,
  "statusCode": 404,
  "path": "/books/unknown-id",
  "timestamp": "2026-06-25T10:00:00.000Z",
  "message": "Record not found"
}
```

---

## Project Structure

```
src/
├── common/
│   ├── decorators/       # @Public(), @Roles()
│   ├── filters/          # Global exception filter
│   └── guards/           # JwtAuthGuard, RolesGuard
├── database/
│   └── prisma/           # PrismaService, PrismaModule
├── modules/
│   ├── auth/             # JWT auth, signup/login/refresh
│   ├── books/            # Books CRUD
│   └── users/            # Users CRUD (admin)
├── app.module.ts
└── main.ts
```

---

## Security

- **Helmet** — sets secure HTTP response headers
- **Rate limiting** — prevents brute-force on auth endpoints
- **JWT** — stateless authentication with short-lived access tokens
- **bcrypt** — password hashing with salt rounds = 10
- **RBAC** — enforced at the guard level on every request
- **Input validation** — `class-validator` with whitelist mode (unknown fields rejected)
- **CORS** — configurable via `CORS_ORIGINS` env variable
