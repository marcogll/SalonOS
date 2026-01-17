import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

/**
 * @description Public API - Retrieves active services
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('location_id')

    let query = supabase
      .from('services')
      .select('id, name, description, duration_minutes, base_price, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (locationId) {
      query = query.eq('location_id', locationId)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('Public services GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      services: services || []
    })
  } catch (error) {
    console.error('Public services GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}