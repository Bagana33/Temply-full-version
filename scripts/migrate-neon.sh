#!/bin/bash

# Migration script for Neon database
# Usage: ./scripts/migrate-neon.sh

DATABASE_URL="${DATABASE_URL:-$(grep DATABASE_URL .env.local | cut -d '=' -f2-)}"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not found in .env.local"
  exit 1
fi

echo "📦 Running migration on Neon database..."
echo ""

# Use psql to execute the schema file
psql "$DATABASE_URL" -f supabase-schema.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
else
  echo ""
  echo "❌ Migration failed. Please check the errors above."
  exit 1
fi

