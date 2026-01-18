/**
 * Update Anchor 23 Services in Database
 * Based on the official service catalog provided
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Anchor 23 Services Data
const anchorServices = [
  // CORE EXPERIENCES
  {
    name: "Anchor Hand Ritual - El anclaje",
    description: "Un ritual consciente para regresar al presente a través del cuidado profundo de las manos. Todo sucede con ritmo lento, precisión y atención absoluta. El resultado es elegante, sobrio y atemporal.",
    duration_minutes: 90,
    base_price: 1400,
    category: "core",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Anchor Hand Signature - Precisión elevada",
    description: "Una versión extendida del ritual, con mayor profundidad y personalización. Pensado para quienes desean una experiencia más pausada y detallada.",
    duration_minutes: 105,
    base_price: 1900,
    category: "core",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Anchor Foot Ritual - La pausa",
    description: "Un ritual diseñado para liberar tensión física y mental acumulada. El cuerpo descansa. La mente se aquieta.",
    duration_minutes: 90,
    base_price: 1800,
    category: "core",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Anchor Foot Signature - Descarga profunda",
    description: "Una experiencia terapéutica extendida que lleva el descanso a otro nivel. Ideal para quienes cargan jornadas intensas y buscan una renovación completa.",
    duration_minutes: 120,
    base_price: 2400,
    category: "core",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Anchor Signature Experience",
    description: "Manos y pies en una sola experiencia integral. Nuestro ritual más representativo: equilibrio, cuidado y presencia total.",
    duration_minutes: 180,
    base_price: 2800,
    category: "core",
    requires_dual_artist: true,
    is_active: true
  },
  {
    name: "Anchor Iconic Experience - Lujo absoluto",
    description: "Una experiencia elevada, privada y poco frecuente. Rituales extendidos, mayor intimidad y atención completamente personalizada. Para cuando solo lo mejor es suficiente.",
    duration_minutes: 210,
    base_price: 3800,
    category: "core",
    requires_dual_artist: true,
    is_active: true
  },

  // NAIL COUTURE
  {
    name: "Diseño de Uñas - Técnica invisible",
    description: "Técnica invisible. Resultado impecable. En Anchor 23 no eliges técnicas. Cada decisión se toma internamente para lograr un resultado elegante, duradero y natural.",
    duration_minutes: 60,
    base_price: 800,
    category: "nails",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Uñas Acrílicas - Resultado impecable",
    description: "Técnica invisible. Resultado impecable. No ofrecemos servicios de mantenimiento ni correcciones. Todo lo necesario para un acabado perfecto está integrado.",
    duration_minutes: 90,
    base_price: 1200,
    category: "nails",
    requires_dual_artist: false,
    is_active: true
  },

  // HAIR FINISHING RITUALS
  {
    name: "Soft Movement - Secado elegante",
    description: "Secado elegante, natural y fluido. Disponible únicamente para clientas con experiencia Anchor el mismo día.",
    duration_minutes: 30,
    base_price: 900,
    category: "hair",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Sleek Finish - Planchado pulido",
    description: "Planchado pulido y sofisticado. Disponible únicamente para clientas con experiencia Anchor el mismo día.",
    duration_minutes: 30,
    base_price: 1100,
    category: "hair",
    requires_dual_artist: false,
    is_active: true
  },

  // LASH & BROW RITUALS
  {
    name: "Lash Lift Ritual",
    description: "Mirada definida con sutileza.",
    duration_minutes: 60,
    base_price: 1600,
    category: "lashes",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Lash Extensions",
    description: "Mirada definida con sutileza. Un retoque a los 15 días está incluido exclusivamente para members.",
    duration_minutes: 120,
    base_price: 2400,
    category: "lashes",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Brow Ritual · Laminated",
    description: "Mirada definida con sutileza.",
    duration_minutes: 45,
    base_price: 1300,
    category: "brows",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Brow Ritual · Henna",
    description: "Mirada definida con sutileza.",
    duration_minutes: 45,
    base_price: 1500,
    category: "brows",
    requires_dual_artist: false,
    is_active: true
  },

  // EVENT EXPERIENCES
  {
    name: "Makeup Signature - Piel perfecta",
    description: "Piel perfecta, elegante y sobria. Agenda especial para eventos.",
    duration_minutes: 90,
    base_price: 1800,
    category: "events",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Makeup Iconic - Maquillaje de evento",
    description: "Maquillaje de evento con carácter y presencia. Agenda especial para eventos.",
    duration_minutes: 120,
    base_price: 2500,
    category: "events",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Hair Signature - Peinado atemporal",
    description: "Peinado atemporal y refinado. Agenda especial para eventos.",
    duration_minutes: 60,
    base_price: 1800,
    category: "events",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Hair Iconic - Peinado de evento",
    description: "Peinado de evento. Agenda especial para eventos.",
    duration_minutes: 90,
    base_price: 2500,
    category: "events",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Makeup & Hair Ritual",
    description: "Agenda especial para eventos.",
    duration_minutes: 150,
    base_price: 3900,
    category: "events",
    requires_dual_artist: true,
    is_active: true
  },
  {
    name: "Bridal Anchor Experience",
    description: "Una experiencia nupcial diseñada con absoluta dedicación y privacidad.",
    duration_minutes: 300,
    base_price: 8000,
    category: "events",
    requires_dual_artist: true,
    is_active: true
  },

  // PERMANENT RITUALS
  {
    name: "Microblading Ritual",
    description: "Agenda limitada · Especialista certificada.",
    duration_minutes: 180,
    base_price: 7500,
    category: "permanent",
    requires_dual_artist: false,
    is_active: true
  },
  {
    name: "Lip Pigment Ritual",
    description: "Agenda limitada · Especialista certificada.",
    duration_minutes: 180,
    base_price: 8500,
    category: "permanent",
    requires_dual_artist: false,
    is_active: true
  }
]

async function updateAnchorServices() {
  console.log('🎨 Updating Anchor 23 Services...\n')

  try {
    // First, deactivate all existing services
    console.log('📝 Deactivating existing services...')
    const { error: deactivateError } = await supabase
      .from('services')
      .update({ is_active: false })
      .neq('is_active', false)

    if (deactivateError) {
      console.warn('⚠️  Warning deactivating services:', deactivateError.message)
    }

    // Insert/update new services
    console.log(`✨ Inserting ${anchorServices.length} Anchor 23 services...`)

    for (let i = 0; i < anchorServices.length; i++) {
      const service = anchorServices[i]
      console.log(`  ${i + 1}/${anchorServices.length}: ${service.name}`)

      const { error: insertError } = await supabase
        .from('services')
        .insert({
          name: service.name,
          description: service.description,
          duration_minutes: service.duration_minutes,
          base_price: service.base_price,
          category: service.category,
          requires_dual_artist: service.requires_dual_artist,
          is_active: service.is_active
        })

      if (insertError) {
        console.warn(`⚠️  Warning inserting ${service.name}:`, insertError.message)
      }
    }

    console.log('✅ Services updated successfully!')

    // Verify the update
    console.log('\n🔍 Verifying services...')
    const { data: services, error: verifyError } = await supabase
      .from('services')
      .select('name, base_price, category')
      .eq('is_active', true)
      .order('category')
      .order('base_price')

    if (verifyError) {
      console.error('❌ Error verifying services:', verifyError)
    } else {
      console.log(`✅ ${services.length} active services:`)
      const categories = {}
      services.forEach(service => {
        if (!categories[service.category]) categories[service.category] = []
        categories[service.category].push(service)
      })

      Object.keys(categories).forEach(category => {
        console.log(`  📂 ${category}: ${categories[category].length} services`)
      })

      console.log('\n💰 Price range:', {
        min: Math.min(...services.map(s => s.base_price)),
        max: Math.max(...services.map(s => s.base_price)),
        avg: Math.round(services.reduce((sum, s) => sum + s.base_price, 0) / services.length)
      })
    }

  } catch (error) {
    console.error('❌ Error updating services:', error)
    process.exit(1)
  }
}

updateAnchorServices()