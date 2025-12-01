# Neon.tech Database Setup

This project is configured to use [Neon.tech](https://neon.tech) as a serverless Postgres database.

## 🚀 Quick Start

### 1. Create a Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string from the dashboard

### 2. Set Environment Variables

Add your Neon database connection string to your `.env.local` file:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Important:** Never commit your `.env.local` file to version control!

### 3. Run the Schema

Run the SQL schema from `supabase-schema.sql` in your Neon database:

1. Go to your Neon dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the script

### 4. Use Neon in Your Code

#### In API Routes (Server-side)

```typescript
import { sql } from '@/lib/neon/server'

export async function GET() {
  const users = await sql`SELECT * FROM users LIMIT 10`
  return Response.json({ users })
}
```

#### In Server Components

```typescript
import { sql } from '@/lib/neon/server'

export default async function Page() {
  const templates = await sql`SELECT * FROM templates WHERE status = 'APPROVED'`
  
  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>{template.title}</div>
      ))}
    </div>
  )
}
```

## 📚 Examples

See `src/lib/neon/example.ts` for comprehensive examples including:
- Querying data
- Inserting records
- Updating records
- Transactions
- Joins

## 🔒 Security Best Practices

1. **Never expose DATABASE_URL in client-side code**
   - Always use server-side API routes or server components
   - The `client.ts` file is provided but should be used sparingly

2. **Use parameterized queries**
   - Always use template literals with Neon: `` sql`SELECT * FROM users WHERE id = ${userId}` ``
   - This prevents SQL injection attacks

3. **Environment Variables**
   - Keep your connection string in `.env.local` (not committed to git)
   - Use different databases for development and production

## 🔄 Migration from Supabase

If you're migrating from Supabase:

1. **Keep Supabase for Auth** (recommended)
   - Neon handles the database
   - Supabase handles authentication
   - Both can work together

2. **Full Migration**
   - Replace all Supabase client calls with Neon SQL queries
   - Implement your own auth system (e.g., NextAuth.js)
   - Update all database operations

## 📖 Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🛠️ Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your Neon project is active
- Ensure SSL mode is set: `?sslmode=require`

### Query Errors

- Check your table names and column names match the schema
- Verify you've run the schema migration
- Check Neon dashboard logs for detailed error messages

### Performance

- Neon uses connection pooling automatically
- Use indexes for frequently queried columns
- Consider using prepared statements for repeated queries

