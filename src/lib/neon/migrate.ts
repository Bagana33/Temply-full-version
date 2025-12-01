/**
 * Migration script to set up the database schema
 * Run with: npx tsx src/lib/neon/migrate.ts
 * 
 * This will execute the SQL schema from supabase-schema.sql
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

const { neon } = require('@neondatabase/serverless')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in .env.local')
  process.exit(1)
}

const sql = neon(databaseUrl)

async function runMigration() {
  try {
    console.log('📦 Reading schema file...')
    const schema = readFileSync(resolve(process.cwd(), 'supabase-schema.sql'), 'utf-8')
    
    console.log('🚀 Running migration...')
    console.log('This may take a few moments...\n')
    
    // Split SQL by semicolons and execute each statement
    // Filter out empty statements and comments
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    let executed = 0
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          // Use sql.query for raw SQL strings
          await sql.query(statement)
          executed++
        } catch (err: any) {
          // Ignore "already exists" errors as the schema is idempotent
          if (!err.message?.includes('already exists') && 
              !err.message?.includes('duplicate') &&
              !err.message?.includes('does not exist')) {
            console.warn(`⚠️  Warning executing statement: ${err.message}`)
            console.warn(`   Statement: ${statement.substring(0, 100)}...`)
          }
        }
      }
    }
    
    console.log(`✅ Executed ${executed} statements`)
    console.log('\n📊 Verifying tables...')
    
    // Verify tables were created
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log(`\n✅ Found ${tables.length} tables:`)
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`)
    })
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

runMigration()

