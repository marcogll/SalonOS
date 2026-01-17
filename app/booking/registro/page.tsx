'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Calendar, Briefcase } from 'lucide-react'

const OCCUPATIONS = [
  'Estudiante',
  'Profesional',
  'Empresario/a',
  'Ama de casa',
  'Artista',
  'Comerciante',
  'Profesor/a',
  'Ingeniero/a',
  'Médico/a',
  'Abogado/a',
  'Otro'
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/booking/cita'
  const emailParam = searchParams.get('email') || ''
  const phoneParam = searchParams.get('phone') || ''

  const [formData, setFormData] = useState({
    email: emailParam,
    phone: phoneParam,
    first_name: '',
    last_name: '',
    birthday: '',
    occupation: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const validationErrors: Record<string, string> = {}

    if (!formData.email.trim() || !formData.email.includes('@')) {
      validationErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'Teléfono requerido'
    }

    if (!formData.first_name.trim()) {
      validationErrors.first_name = 'Nombre requerido'
    }

    if (!formData.last_name.trim()) {
      validationErrors.last_name = 'Apellido requerido'
    }

    if (!formData.birthday) {
      validationErrors.birthday = 'Fecha de nacimiento requerida'
    }

    if (!formData.occupation) {
      validationErrors.occupation = 'Ocupación requerida'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const params = new URLSearchParams({
          customer_id: data.customer.id,
          ...Object.fromEntries(searchParams.entries())
        })
        router.push(`${redirect}?${params.toString()}`)
      } else {
        if (data.message === 'El cliente ya existe') {
          const params = new URLSearchParams({
            customer_id: data.customer.id,
            ...Object.fromEntries(searchParams.entries())
          })
          router.push(`${redirect}?${params.toString()}`)
        } else {
          setErrors({ submit: data.error || 'Error al registrar cliente' })
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Error registrando cliente:', error)
      setErrors({ submit: 'Error al registrar cliente' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bone-white)] pt-24">
      <div className="max-w-md mx-auto px-8 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl mb-4" style={{ color: 'var(--charcoal-brown)' }}>
            Anchor:23
          </h1>
          <p className="text-lg opacity-80" style={{ color: 'var(--charcoal-brown)' }}>
            Completa tu registro
          </p>
        </header>

        <Card className="border-none" style={{ background: 'var(--soft-cream)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--charcoal-brown)' }}>
              Registro de Cliente
            </CardTitle>
            <CardDescription>
              Ingresa tus datos personales para completar tu reserva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    style={{ borderColor: errors.email ? '#ef4444' : 'var(--mocha-taupe)' }}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    style={{ borderColor: errors.phone ? '#ef4444' : 'var(--mocha-taupe)' }}
                    placeholder="+52 844 123 4567"
                  />
                </div>
                {errors.phone && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Nombre *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="pl-10"
                      style={{ borderColor: errors.first_name ? '#ef4444' : 'var(--mocha-taupe)' }}
                      placeholder="María"
                    />
                  </div>
                  {errors.first_name && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.first_name}</p>}
                </div>

                <div>
                  <Label htmlFor="last_name">Apellido *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    style={{ borderColor: errors.last_name ? '#ef4444' : 'var(--mocha-taupe)' }}
                    placeholder="García"
                  />
                  {errors.last_name && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.last_name}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="birthday">Fecha de Nacimiento *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="pl-10"
                    style={{ borderColor: errors.birthday ? '#ef4444' : 'var(--mocha-taupe)' }}
                  />
                </div>
                {errors.birthday && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.birthday}</p>}
              </div>

              <div>
                <Label htmlFor="occupation">Ocupación *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none"
                    style={{ borderColor: errors.occupation ? '#ef4444' : 'var(--mocha-taupe)', background: 'var(--bone-white)' }}
                  >
                    <option value="">Selecciona tu ocupación</option>
                    {OCCUPATIONS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>
                {errors.occupation && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.occupation}</p>}
              </div>

              {errors.submit && (
                <div className="p-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                style={{ background: 'var(--deep-earth)' }}
              >
                {loading ? 'Procesando...' : 'Continuar con la Reserva'}
              </Button>

              <div className="text-sm" style={{ color: 'var(--charcoal-brown)', opacity: 0.6 }}>
                * Al registrarte, aceptas nuestros términos y condiciones.
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            style={{ borderColor: 'var(--mocha-taupe)', color: 'var(--charcoal-brown)' }}
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  )
}
