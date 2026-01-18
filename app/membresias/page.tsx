'use client'

import { useState } from 'react'
import { AnimatedLogo } from '@/components/animated-logo'
import { RollingPhrases } from '@/components/rolling-phrases'
import { Crown, Star, Award, Diamond } from 'lucide-react'
import { getDeviceType, sendWebhookPayload } from '@/lib/webhook'

/** @description Membership tiers page component displaying exclusive membership options and application forms. */
export default function MembresiasPage() {
  const [formData, setFormData] = useState({
    membership_id: '',
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const tiers = [
    {
      id: 'gold',
      name: 'GOLD TIER',
      icon: Star,
      description: 'Acceso curado y acompañamiento continuo.',
      price: '$2,500 MXN',
      period: '/mes',
      benefits: [
        'Prioridad de agenda en experiencias Anchor',
        'Beauty Concierge para asesoría y coordinación de rituales',
        'Acceso a horarios preferentes',
        'Consulta de belleza mensual',
        'Producto curado de cortesía mensual',
        'Invitación anticipada a experiencias privadas'
      ]
    },
    {
      id: 'black',
      name: 'BLACK TIER',
      icon: Award,
      description: 'Privilegios premium y atención extendida.',
      price: '$5,000 MXN',
      period: '/mes',
      benefits: [
        'Prioridad absoluta de agenda (sin listas de espera)',
        'Beauty Concierge dedicado con seguimiento integral',
        'Acceso a espacios privados y bloques extendidos',
        'Dos rituales complementarios curados al mes',
        'Set de productos premium trimestral',
        'Acceso VIP a eventos cerrados'
      ]
    },
    {
      id: 'vip',
      name: 'VIP TIER',
      icon: Crown,
      description: 'Acceso total y curaduría absoluta.',
      price: '$10,000 MXN',
      period: '/mes',
      featured: true,
      benefits: [
        'Acceso inmediato y sin restricciones de agenda',
        'Beauty Concierge exclusivo + estilista asignado',
        'Experiencias personalizadas ilimitadas (agenda privada)',
        'Acceso a instalaciones fuera de horario',
        'Evento privado anual para la member + 5 invitadas',
        'Curaduría integral de rituales, productos y experiencias'
      ]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const payload = {
      form: 'memberships',
      membership_id: formData.membership_id,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      mensaje: formData.mensaje,
      timestamp_utc: new Date().toISOString(),
      device_type: getDeviceType()
    }

    try {
      await sendWebhookPayload(payload)
      setSubmitted(true)
      setShowThankYou(true)
      window.setTimeout(() => setShowThankYou(false), 3500)
      setFormData({
        membership_id: '',
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      })
    } catch (error) {
      setSubmitError('No pudimos enviar tu solicitud. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleApply = (tierId: string) => {
    setFormData((prev) => ({
      ...prev,
      membership_id: tierId
    }))
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <AnimatedLogo />
          <h1>Membresías</h1>
          <h2>Anchor:23</h2>
          <RollingPhrases />
          <div className="hero-actions">
            <a href="#tiers" className="btn-secondary">Ver Membresías</a>
            <a href="#solicitud" className="bg-[#3E352E] text-white hover:bg-[#3E352E]/90 px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center">Solicitar Membresía</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Membresías Hero</span>
          </div>
        </div>
      </section>

      <section className="foundation" id="tiers">
        <article>
          <h3>Nota operativa</h3>
          <h4>Las membresías no sustituyen el valor de las experiencias.</h4>
          <p>
            No existen descuentos ni negociaciones de estándar. Los beneficios se centran en tiempo, acceso, privacidad y criterio.
          </p>
          <p>
            ANCHOR 23. Un espacio privado donde el tiempo se desacelera. No trabajamos con volumen. Trabajamos con intención.
          </p>
        </article>
        <aside className="foundation-image">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Membresías</span>
          </div>
        </aside>
      </section>

      <section className="services-preview">
        <h3>ANCHOR 23 · MEMBRESÍAS</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <article
                key={tier.id}
                className={`relative p-8 rounded-2xl shadow-lg border-2 transition-all ${
                  tier.featured
                    ? 'bg-[#3E352E] border-[#3E352E] text-white transform scale-105'
                    : 'bg-white border-gray-100 hover:border-[#3E352E] hover:shadow-xl'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#3E352E] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className={`flex items-center justify-center mb-6 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  <Icon className="w-12 h-12" />
                </div>

                <h4 className={`text-2xl font-bold mb-2 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h4>

                <p className={`mb-6 ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
                <p className={`mb-6 text-sm ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                  Las membresías no ofrecen descuentos. Otorgan acceso prioritario, servicios plus y Beauty Concierge dedicado.
                </p>

                <div className="mb-8">
                  <div className={`text-4xl font-bold mb-1 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                    {tier.price}
                  </div>
                  <div className={`text-sm ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tier.period}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`mr-2 mt-1 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                        ✓
                      </span>
                      <span className={tier.featured ? 'text-gray-200' : 'text-gray-700'}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleApply(tier.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    tier.featured
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-[#3E352E] text-white hover:bg-[#3E352E]/90'
                  }`}
                >
                  Solicitar {tier.name}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <section className="testimonials" id="solicitud">
        <h3>Solicitud de Membresía</h3>
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
              <Diamond className="w-12 h-12 text-green-900 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-green-900 mb-2">
                Solicitud Recibida
              </h4>
              <p className="text-green-800">
                Gracias por tu interés. Nuestro equipo revisará tu solicitud y te
                contactará pronto para completar el proceso.
              </p>
            </div>
          ) : (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              {formData.membership_id && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 text-center">
                  <span className="font-semibold text-gray-900">
                    Membresía Seleccionada: {tiers.find(t => t.id === formData.membership_id)?.name}
                  </span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="membership_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Membresía
                  </label>
                  <select
                    id="membership_id"
                    name="membership_id"
                    value={formData.membership_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="" disabled>Selecciona una membresía</option>
                    {tiers.map((tier) => (
                      <option key={tier.id} value={tier.id}>{tier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="+52 844 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje (Opcional)
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    placeholder="¿Tienes alguna pregunta específica?"
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-sm text-red-600 text-center">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="bg-[#3E352E] text-white hover:bg-[#3E352E]/90 px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
