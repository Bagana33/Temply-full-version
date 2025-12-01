import { neon, neonConfig } from '@neondatabase/serverless'

// Configure Neon for optimal performance
neonConfig.fetchConnectionCache = true

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Please set your Neon database connection string.')
}

// Create the Neon HTTP client
// Use this in client components (though typically you'd use server.ts in API routes)
export const sql = neon(databaseUrl)

/**
 * Client-side Neon database client
 * Note: For security, prefer using server-side API routes instead of direct client access
 * 
 * @example
 * const result = await sql`SELECT * FROM users WHERE id = ${userId}`
 */
export { sql as default }

