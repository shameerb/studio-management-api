#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate

echo "Seeding database..."

if [ -f "dist/prisma/seed.js" ]; then
  node dist/prisma/seed.js || echo "Seeding failed or already seeded"
else
  echo "Seed file not found, skipping seeding"
fi

echo "Starting application..."
exec node dist/main
