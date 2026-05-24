# Task Manager

A production-ready, full-stack task management application built on a microservices architecture. Features JWT authentication with role-based access control, Redis caching, rate limiting, and a modern Next.js frontend — fully containerised and runnable with a single Docker Compose command.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

> **Documentation**
>
> | Guide | Description |
> |-------|-------------|
> | [Setup Guide](./docs/SETUP_GUIDE.md) | Docker & local dev setup |
> | [API Reference](./docs/API_REFERENCE.md) | All endpoints with examples |
> | [Architecture](./docs/ARCHITECTURE.md) | System design & request flows |
> | [Database Schema](./docs/DATABASE_SCHEMA.md) | Collections, fields, indexes |
> | [Redis Caching](./docs/REDIS_CACHING.md) | Cache strategy & verification |
> | [Security](./docs/SECURITY.md) | Auth, RBAC, rate limiting, CORS |
> | [Scalability](./docs/SCALABILITY_NOTE.md) | What's implemented & the roadmap |

---

## Quick Start

```bash
git clone https://github.com/suryaparua-official/Distributed-Task-Management-System.git
cd Distributed-Task-Management-System

docker compose up --build
```

All 6 services start and health-check automatically. Wait ~30 seconds for all containers to report `healthy`, then open:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** (Nginx) | http://localhost:8080 |
| **User Service Swagger** | http://localhost:5000/api-docs |
| **Task Service Swagger** | http://localhost:5001/api-docs |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

> **Check container health:** `docker compose ps` — all services should show `(healthy)` before using the app.

### Creating an Admin User

There is no default admin account. Register via the UI, then promote the account through the MongoDB shell:

```bash
docker compose exec mongo mongosh
use taskmanager
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
exit
```

Log out and back in — the **Admin** panel appears in the sidebar.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 |
| Gateway | Nginx (reverse proxy · CORS · load balancing) |
| Auth Service | Node.js 22 · Express 5 · TypeScript · JWT · bcryptjs |
| Task Service | Node.js 22 · Express 5 · TypeScript · Redis client |
| Cache | Redis 7 (60-second task list cache, write-through invalidation) |
| Database | MongoDB 6 · Mongoose (two collections, compound indexes) |
| Validation | Zod (both services) |
| Logging | Winston (structured JSON logs) |
| API Docs | Swagger UI (both services) |
| Containerisation | Docker · Docker Compose (6 services) |

---

## Features

### Authentication & Authorisation
- Register and login with email/password
- JWT tokens (HS256, 7-day expiry) — stateless, horizontal-scale ready
- Role-based access control: `user` and `admin` roles
- Rate limiting: 10 requests per IP per 15 minutes on auth endpoints

### Task Management
- Full CRUD with per-user ownership enforcement
- Pagination: `GET /tasks?page=1&limit=20` (max 100/page)
- Redis caching: default task list cached 60 seconds, invalidated on any write
- `userId` index on tasks collection — O(log n) lookups at scale

### Frontend (Next.js)
- Sign-in / sign-up with toast notifications
- Protected dashboard — redirects to login if unauthenticated
- Task list: create, inline edit, toggle complete, delete
- Dashboard overview with task progress bar
- Admin panel: view and delete any user (admin role only)

### Infrastructure
- 6-container Docker Compose: `mongo`, `redis`, `user-service`, `task-service`, `nginx`, `frontend`
- Healthcheck-gated `depends_on` — each service waits for its dependencies to be healthy before starting
- Named volumes for MongoDB and Redis — data persists across restarts
- Multi-stage Dockerfiles — lean production images
- `output: standalone` Next.js — minimal frontend container

---

## API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | None | Register user |
| `POST` | `/api/v1/auth/login` | None | Login, receive JWT |
| `GET` | `/api/v1/auth/me` | Bearer | Get own profile |
| `GET` | `/api/v1/tasks` | Bearer | List tasks (Redis cached) |
| `POST` | `/api/v1/tasks` | Bearer | Create task |
| `PUT` | `/api/v1/tasks/:id` | Bearer | Update task |
| `DELETE` | `/api/v1/tasks/:id` | Bearer | Delete task |
| `GET` | `/api/v1/auth/users` | Admin | List all users |
| `DELETE` | `/api/v1/auth/users/:id` | Admin | Delete a user |

Full request/response examples: [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)

---

## Project Structure

```
.
├── docker-compose.yml          # Orchestrates all 6 services
├── .env.example                # Root env template (JWT_SECRET override)
├── docs/                       # Technical documentation
├── frontend/                   # Next.js app (standalone output)
│   ├── Dockerfile
│   └── src/
│       ├── app/                # Pages: login, register, dashboard
│       ├── components/         # Navbar, Sidebar, Loader
│       └── context/            # AppContext — global auth & task state
└── services/
    ├── nginx/                  # Nginx gateway (CORS, routing)
    ├── user-service/           # Auth microservice (port 5000)
    │   └── src/
    │       ├── controllers/    # register, login
    │       ├── middleware/     # auth, admin, validate, requestLogger
    │       ├── models/         # User schema
    │       ├── routes/         # /api/v1/auth
    │       └── utils/          # JWT, Winston logger
    └── task-service/           # Task CRUD microservice (port 5001)
        └── src/
            ├── config/         # MongoDB connection, Redis client
            ├── controllers/    # getTasks, createTask, updateTask, deleteTask
            ├── middleware/     # auth, validate, requestLogger
            ├── models/         # Task schema (userId index)
            └── routes/         # /api/v1/tasks
```

---

## Environment Configuration

Docker Compose works out of the box with built-in defaults. To override the JWT secret (recommended for any shared environment):

```bash
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
docker compose up --build
```

See [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for full environment variable documentation.

---

## Docker Cleanup

If containers from a previous run are still alive, the next `up` may report a naming conflict. Use `--remove-orphans` to clear them automatically:

```bash
# Recommended: stop everything, delete volumes, remove orphan containers, rebuild fresh
docker compose down -v --remove-orphans
docker compose up --build
```

Other useful cleanup commands:

```bash
# Stop containers without deleting data volumes
docker compose down --remove-orphans

# Remove all stopped containers (project-wide)
docker compose rm -f

# Nuclear reset — removes all unused images, containers, volumes, and networks
# WARNING: this affects the entire Docker environment, not just this project
docker system prune -a --volumes
```

> Container names are managed automatically by Compose under the `task-manager` project namespace (e.g. `task-manager-nginx-1`). Never set `container_name` manually — it bypasses namespacing and causes conflicts on repeated runs.

---

## License

MIT — see [LICENSE.md](LICENSE.md)
