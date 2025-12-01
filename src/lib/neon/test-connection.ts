/**
 * Test script to verify Neon database connection
 * Run with: npx tsx src/lib/neon/test-connection.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file BEFORE importing server
config({ path: resolve(process.cwd(), '.env.local') })

// Now import after env is loaded
const { neon, neonConfig } = require('@neondatabase/serverless')

neonConfig.fetchConnectionCache = true

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in .env.local')
  process.exit(1)
}

const sql = neon(databaseUrl)

async function testConnection() {
  try {
    console.log('Testing Neon database connection...')
    console.log('Connection string:', databaseUrl.replace(/:[^:@]+@/, ':****@')) // Hide password
    
    // Simple query to test connection
    const result = await sql`SELECT version() as version, current_database() as database, current_user as user`
    
    console.log('✅ Connection successful!')
    console.log('Database Info:')
    console.log('  Version:', result[0]?.version)
    console.log('  Database:', result[0]?.database)
    console.log('  User:', result[0]?.user)
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log('\n📊 Existing tables:')
    if (tables.length === 0) {
      console.log('  No tables found. You need to run the schema migration.')
    } else {
      tables.forEach((table: any) => {
        console.log(`  - ${table.table_name}`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  }
}

testConnection()

