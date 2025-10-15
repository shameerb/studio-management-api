# Studio Management API

SaaS API for Yoga Studios to expose class data and booking functionality to cooperators (third-party partners).

## Features

- Venue information management
- Live class inventory and availability
- Reservation management
- JWT authentication with OAuth2
- API key authentication for cooperators
- Rate limiting and throttling
- Redis caching

## Tech Stack

- NestJS
- Prisma ORM
- MySQL
- Redis
- Docker

## Local Development

### Prerequisites

- Node.js 20+
- MySQL 8.0
- Redis 7

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional).
npm run prisma:seed

# Start development server
npm run start:dev
```

API runs on `http://localhost:3000`

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/studio_management"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_TTL=300
PORT=3000
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1h"
JWT_ISSUER="studio-management-api"
JWT_AUDIENCE="cooperators"
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CACHE_TTL=300
```

## Production Deployment

### Using Docker Compose

```bash
# Start all services (MySQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Build and Run Docker Image

```bash
# Build image
docker build -t studio-management-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@mysql:3306/studio_management" \
  -e REDIS_HOST="redis" \
  -e JWT_SECRET="your-secret-key" \
  studio-management-api
```

### Production Build

```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

## Available Scripts

- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run test` - Run tests
- `npm run lint` - Lint code