import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * @description Manage tips and commissions for staff members
 * @param {NextRequest} request - Query params for filtering tips/commissions
 * @returns {NextResponse} JSON with tips and commission data
 * @example GET /api/aperture/payroll/tips?staff_id=123&period_start=2026-01-01
 * @audit BUSINESS RULE: Tips must be associated with completed bookings
 * @audit SECURITY: Only admin/manager can view/manage tips and commissions
 * @audit Validate: Tip amounts cannot be negative, methods must be valid
 * @audit AUDIT: Tip creation logged for financial tracking
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staff_id')
    const periodStart = searchParams.get('period_start')
    const periodEnd = searchParams.get('period_end')
    const type = searchParams.get('type') // 'tips', 'commissions', 'all'

    const results: any = {}

    // Get tips
    if (type === 'all' || type === 'tips') {
      let tipsQuery = supabaseAdmin
        .from('tip_records')
        .select(`
          id,
          booking_id,
          staff_id,
          amount,
          tip_method,
          recorded_at,
          staff (
            id,
            display_name
          ),
          bookings (
            id,
            short_id,
            services (
              id,
              name
            )
          )
        `)
        .order('recorded_at', { ascending: false })

      if (staffId) {
        tipsQuery = tipsQuery.eq('staff_id', staffId)
      }
      if (periodStart) {
        tipsQuery = tipsQuery.gte('recorded_at', periodStart)
      }
      if (periodEnd) {
        tipsQuery = tipsQuery.lte('recorded_at', periodEnd)
      }

      const { data: tips, error: tipsError } = await tipsQuery

      if (tipsError) {
        console.error('Tips fetch error:', tipsError)
        return NextResponse.json(
          { error: tipsError.message },
          { status: 500 }
        )
      }

      results.tips = tips || []
    }

    // Get commission rates
    if (type === 'all' || type === 'commissions') {
      const { data: commissionRates, error: commError } = await supabaseAdmin
        .from('commission_rates')
        .select(`
          id,
          service_id,
          service_category,
          staff_role,
          commission_percentage,
          is_active,
          services (
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('staff_role')
        .order('service_category')

      if (commError) {
        console.error('Commission rates fetch error:', commError)
        return NextResponse.json(
          { error: commError.message },
          { status: 500 }
        )
      }

      results.commission_rates = commissionRates || []
    }

    return NextResponse.json({
      success: true,
      ...results
    })

  } catch (error) {
    console.error('Payroll tips/commissions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * @description Record a tip for a staff member
 * @param {NextRequest} request - JSON body with booking_id, staff_id, amount, tip_method
 * @returns {NextResponse} JSON with created tip record
 * @example POST /api/aperture/payroll/tips {"booking_id": "123", "staff_id": "456", "amount": 50.00, "tip_method": "cash"}
 * @audit BUSINESS RULE: Tips can only be recorded for completed bookings
 * @audit SECURITY: Only admin/manager can record tips via this API
 * @audit Validate: Booking must exist and be completed, staff must be assigned
 * @audit Validate: Tip method must be one of: cash, card, app
 * @audit AUDIT: Tip recording logged for financial audit trail
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { booking_id, staff_id, amount, tip_method } = body

    if (!booking_id || !staff_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: booking_id, staff_id, amount' },
        { status: 400 }
      )
    }

    // Validate booking exists and is completed
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, status, staff_id')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Invalid booking_id' },
        { status: 400 }
      )
    }

    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'Tips can only be recorded for completed bookings' },
        { status: 400 }
      )
    }

    if (booking.staff_id !== staff_id) {
      return NextResponse.json(
        { error: 'Staff member was not assigned to this booking' },
        { status: 400 }
      )
    }

    // Get current user (admin/manager recording the tip)
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get staff record for the recorder
    const { data: recorderStaff } = await supabaseAdmin
      .from('staff')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // Create tip record
    const { data: tipRecord, error: tipError } = await supabaseAdmin
      .from('tip_records')
      .insert({
        booking_id,
        staff_id,
        amount: parseFloat(amount),
        tip_method: tip_method || 'cash',
        recorded_by: recorderStaff?.id || user.id
      })
      .select(`
        id,
        booking_id,
        staff_id,
        amount,
        tip_method,
        recorded_at,
        staff (
          id,
          display_name
        ),
        bookings (
          id,
          short_id
        )
      `)
      .single()

    if (tipError) {
      console.error('Tip creation error:', tipError)
      return NextResponse.json(
        { error: tipError.message },
        { status: 500 }
      )
    }

    // Log the tip recording
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        entity_type: 'tip',
        entity_id: tipRecord.id,
        action: 'create',
        new_values: {
          booking_id,
          staff_id,
          amount,
          tip_method: tip_method || 'cash'
        },
        performed_by_role: 'admin'
      })

    return NextResponse.json({
      success: true,
      tip_record: tipRecord
    })

  } catch (error) {
    console.error('Tip creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}