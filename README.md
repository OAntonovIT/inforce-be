# NestJS Books API

## Description

Backend API with JWT authentication, role-based access control and Prisma ORM.

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

# 🧠 6. ENV VARIABLES (IMPORTANT)

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
