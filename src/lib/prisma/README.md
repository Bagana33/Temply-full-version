# Prisma Setup with Neon

Prisma is configured to work with your Neon database.

## Current Status

✅ Prisma installed and configured  
✅ Database connection verified  
⚠️ Database schema not yet applied

## Next Steps

1. **Run the database schema migration:**
   - Option A: Use Neon Dashboard SQL Editor
     - Copy contents of `supabase-schema.sql`
     - Paste and run in Neon SQL Editor
   
   - Option B: Use psql command
     ```bash
     psql 'postgresql://neondb_owner:npg_nEeQm4XIutk2@ep-bold-mouse-a4j8rrid-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f supabase-schema.sql
     ```

2. **After schema is applied, introspect the database:**
   ```bash
   npx prisma db pull
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## Usage

Once the schema is set up, you can use Prisma in your code:

```typescript
import { prisma } from '@/lib/prisma/client'

// Example: Get all templates
const templates = await prisma.templates.findMany({
  where: { status: 'APPROVED' }
})

// Example: Create a template
const template = await prisma.templates.create({
  data: {
    title: 'My Template',
    description: 'A great template',
    price: 1000,
    // ... other fields
  }
})
```

## Prisma vs Raw SQL

You now have two options for database access:

1. **Prisma ORM** (`@/lib/prisma/client`) - Type-safe, easier to use
2. **Neon Raw SQL** (`@/lib/neon/server`) - More control, direct SQL queries

Choose based on your needs!

