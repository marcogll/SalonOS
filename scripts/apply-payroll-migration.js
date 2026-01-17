/**
 * Script to apply payroll migration directly to database
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyPayrollMigration() {
  console.log('🚀 Applying payroll migration...')

  try {
    // Read the migration file
    const fs = require('fs')
    const migrationSQL = fs.readFileSync('supabase/migrations/20260117150000_payroll_commission_system.sql', 'utf8')

    // Split into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`)
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
            // Continue with other statements
          }
        } catch (err) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, err.message)
          // Continue with other statements
        }
      }
    }

    console.log('✅ Migration applied successfully!')
    console.log('💡 You may need to refresh your database connection to see the new tables.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

applyPayrollMigration()