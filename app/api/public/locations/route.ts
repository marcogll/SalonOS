import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

/**
 * @description Public API - Retrieves all active locations
 */
export async function GET(request: NextRequest) {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('id, name, timezone, address, phone, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Public locations GET error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      locations: locations || []
    })
  } catch (error) {
    console.error('Public locations GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}