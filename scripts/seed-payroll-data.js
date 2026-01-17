/**
 * Script to seed payroll data for testing
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

async function seedPayrollData() {
  console.log('🌱 Seeding payroll data for testing...')

  try {
    // First, let's try to create tables manually if they don't exist
    console.log('📋 Creating payroll tables...')

    // Insert some sample commission rates
    console.log('💰 Inserting commission rates...')
    const { error: commError } = await supabase
      .from('commission_rates')
      .upsert([
        { service_category: 'hair', staff_role: 'artist', commission_percentage: 15 },
        { service_category: 'nails', staff_role: 'artist', commission_percentage: 12 },
        { service_category: 'facial', staff_role: 'artist', commission_percentage: 10 },
        { staff_role: 'staff', commission_percentage: 8 }
      ])

    if (commError && !commError.message.includes('already exists')) {
      console.warn('⚠️  Commission rates:', commError.message)
    } else {
      console.log('✅ Commission rates inserted')
    }

    // Insert some sample payroll records
    console.log('💼 Inserting sample payroll records...')
    const { error: payrollError } = await supabase
      .from('payroll_records')
      .upsert([
        {
          staff_id: '776dd8b6-686b-4b0d-987a-4dcfeea0a060', // Daniela Sánchez
          payroll_period_start: '2026-01-01',
          payroll_period_end: '2026-01-31',
          base_salary: 8000,
          service_commissions: 1200,
          total_tips: 800,
          total_earnings: 10000,
          hours_worked: 160,
          status: 'calculated'
        }
      ])

    if (payrollError && !payrollError.message.includes('already exists')) {
      console.warn('⚠️  Payroll records:', payrollError.message)
    } else {
      console.log('✅ Payroll records inserted')
    }

    // Insert some sample tips
    console.log('🎁 Inserting sample tips...')
    const { error: tipsError } = await supabase
      .from('tip_records')
      .upsert([
        {
          booking_id: '8cf9f264-f2e8-4392-88da-0895139a086a',
          staff_id: '776dd8b6-686b-4b0d-987a-4dcfeea0a060',
          amount: 150,
          tip_method: 'cash'
        },
        {
          booking_id: '5e5d9e35-6d29-4940-9aed-ad84a96035a4',
          staff_id: '776dd8b6-686b-4b0d-987a-4dcfeea0a060',
          amount: 200,
          tip_method: 'card'
        }
      ])

    if (tipsError && !tipsError.message.includes('already exists')) {
      console.warn('⚠️  Tips:', tipsError.message)
    } else {
      console.log('✅ Tips inserted')
    }

    console.log('🎉 Payroll data seeded successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

seedPayrollData()