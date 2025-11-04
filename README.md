# Line Item API

A TypeScript Express API with PostgreSQL for managing shopping carts and line items.

## Features

- JWT-based authentication
- PostgreSQL database with Slonik client
- Docker Compose for local development
- ESLint and Prettier for code quality
- TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and adjust if needed:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d
```

Wait a few seconds for PostgreSQL to be ready.

### 4. Run Database Migrations

```bash
npm run migrate
```

This will create the database tables and seed initial data:
- 2 users: `user1` (password: `password1`) and `user2` (password: `password2`)
- Each user has 1 active cart and 1 completed cart
- Each cart has 3 line items (2 non-free, 1 free)

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### POST /login

Public endpoint for user authentication.

**Request:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "XXX", "password": "XXX"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /cart

Protected endpoint that returns the active cart for the authenticated user.

**Request:**
```bash
curl http://localhost:3000/cart \
  -H "x-api-token: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "id": 1,
  "total": 300
}
```

The total is the sum of all non-free line items in the active cart.

## Database Schema

### users
- `id` (PK, SERIAL)
- `username` (VARCHAR, NOT NULL, UNIQUE)
- `password` (VARCHAR, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)
- `updated_at` (TIMESTAMP, NOT NULL)

### carts
- `id` (PK, SERIAL)
- `user_id` (FK to users, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)
- `updated_at` (TIMESTAMP, NOT NULL)
- `completed_at` (TIMESTAMP, NULL)

### line_items
- `id` (VARCHAR, PK)
- `cart_id` (FK to carts, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `price` (INTEGER, NOT NULL)
- `is_free` (BOOLEAN, NOT NULL)

## NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm run migrate` - Run database migrations
- `npm run lint` - Lint and auto-fix code
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── main.ts              # Express app entry point
├── routes/
│   ├── login.ts         # POST /login endpoint
│   └── cart.ts          # GET /cart endpoint
├── middleware/
│   └── auth.ts          # JWT validation middleware
├── db/
│   └── connection.ts    # Slonik database connection
└── types/
    └── express.d.ts     # Express type extensions

migrations/
├── 001-create-users-table.ts
├── 002-create-carts-table.ts
├── 003-create-line-items-table.ts
├── 004-seed-data.ts
└── run-migrations.ts    # Migration runner
```

## Development Notes

- Passwords are stored in plain text (not suitable for production)
- JWT tokens expire after 24 hours
- The JWT secret should be changed in production
- Active carts have `completed_at` set to NULL
- The cart total only includes line items where `is_free = false`