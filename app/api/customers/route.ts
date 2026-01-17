import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Se requiere email o teléfono' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin.from('customers').select('*').eq('is_active', true)

    if (email) {
      query = query.ilike('email', email)
    } else if (phone) {
      query = query.ilike('phone', phone)
    }

    const { data: customers, error } = await query.limit(1)

    if (error) {
      console.error('Error buscando cliente:', error)
      return NextResponse.json(
        { error: 'Error al buscar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      exists: customers && customers.length > 0,
      customer: customers && customers.length > 0 ? customers[0] : null
    })
  } catch (error) {
    console.error('Error en GET /api/customers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, first_name, last_name, birthday, occupation } = body

    if (!email || !phone || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: email, phone, first_name, last_name' },
        { status: 400 }
      )
    }

    const { data: existingCustomer, error: checkError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .or(`email.ilike.${email},phone.ilike.${phone}`)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error verificando cliente existente:', checkError)
      return NextResponse.json(
        { error: 'Error al verificar cliente existente' },
        { status: 500 }
      )
    }

    if (existingCustomer) {
      return NextResponse.json({
        success: false,
        message: 'El cliente ya existe',
        customer: existingCustomer
      })
    }

    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from('customers')
      .insert({
        email,
        phone,
        first_name,
        last_name,
        tier: 'free',
        total_spent: 0,
        total_visits: 0,
        is_active: true,
        notes: birthday || occupation ? JSON.stringify({ birthday, occupation }) : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creando cliente:', insertError)
      return NextResponse.json(
        { error: 'Error al crear cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente registrado exitosamente',
      customer: newCustomer
    })
  } catch (error) {
    console.error('Error en POST /api/customers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
