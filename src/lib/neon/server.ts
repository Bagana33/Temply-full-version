import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Please set your Neon database connection string.')
}

/**
 * Server-side Neon database client
 * Use this in API routes, server components, and server actions
 * 
 * @example
 * const sql = getServerNeonClient()
 * const result = await sql`SELECT * FROM users WHERE id = ${userId}`
 */
export function getServerNeonClient() {
  return neon(databaseUrl)
}

// Export a default instance for convenience
export const sql = getServerNeonClient()

