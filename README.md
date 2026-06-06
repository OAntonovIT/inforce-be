# NestJS Books API

## Description

A backend API built with NestJS featuring JWT authentication (access & refresh token strategy), role-based access control (RBAC), Prisma ORM with PostgreSQL (Neon), and built-in pagination and search for efficient and scalable data retrieval.

---

## Tech Stack

- NestJS
- Prisma
- PostgreSQL (Neon)
- JWT Authentication
- Class Validator

---

## Roles

### User

- Get all books
- Get book by id

### Admin

- Full CRUD on books
- Full CRUD on users

---

## Setup

### 1. Install dependencies

npm install

### 2. Setup environment variables

Create `.env` file:

---

### 3. Run Prisma

```bash
npx prisma generate
npx prisma db push
```

npm run start:dev

API Endpoints
Auth
POST /auth/signup
POST /auth/login
POST /refresh

Users (admin only)
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id

Books
GET /books
GET /books/:id
POST /books (admin)
PATCH /books/:id (admin)
DELETE /books/:id (admin)

---

# 🧠 4. ENV VARIABLES (IMPORTANT)

```env
# ======================
# Database Configuration
# ======================
DATABASE_URL="postgresql://neondb_owner:npg_P7JahnBVo9gw@ep-proud-field-abx9fsw3.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# ======================
# JWT Authentication
# ======================
JWT_SECRET=superSecretKey123!ChangeThisInProductionToALongRandomString

# ======================
# Application
# ======================
PORT=3000
```

## Important Notes

- Role-based access control (RBAC) is fully enforced on the backend (not only on the frontend).
- All errors are properly handled with clear and structured JSON error responses.
- The project uses Prisma ORM with a hosted PostgreSQL database (Neon).
- The project follows a clean **feature-based structure** using NestJS modules.
- The authentication system implements a token-based strategy (JWT) using both access and refresh tokens for secure session management.
- Pagination and search functionality are implemented for both Users and Books endpoints, allowing efficient data querying and scalable API responses.
