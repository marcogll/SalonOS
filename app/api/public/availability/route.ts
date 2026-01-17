import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

/**
 * @description Public API - Retrieves basic availability information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('location_id')

    if (!locationId) {
      return NextResponse.json(
        { error: 'Missing required parameter: location_id' },
        { status: 400 }
      )
    }

    // Get location details
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .select('id, name, timezone')
      .eq('id', locationId)
      .eq('is_active', true)
      .single()

    if (locationError || !location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Get active services for this location
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name, duration_minutes, base_price')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (servicesError) {
      console.error('Public availability services error:', servicesError)
      return NextResponse.json(
        { error: servicesError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location,
      services: services || [],
      note: 'Use /api/availability/time-slots for detailed availability'
    })
  } catch (error) {
    console.error('Public availability GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}