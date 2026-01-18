'use client'

import { AnimatedLogo } from '@/components/animated-logo'
import { RollingPhrases } from '@/components/rolling-phrases'
import { Building2, Map, Mail, Phone, Users, Crown } from 'lucide-react'
import { WebhookForm } from '@/components/webhook-form'

/** @description Franchise information and application page component for potential franchise partners. */
export default function FranchisesPage() {

  const benefits = [
    'Modelo de negocio exclusivo y probado',
    'Una sucursal por ciudad: saturación controlada',
    'Sistema operativo completo (AnchorOS)',
    'Capacitación en estándares de lujo',
    'Membresía de clientes como fuente recurrente',
    'Soporte continuo y actualizaciones',
    'Manuales operativos completos',
    'Plataforma de entrenamientos digital',
    'Sistema de RH integrado en AnchorOS'
  ]

  const requirements = [
    'Compromiso inquebrantable con la calidad',
    'Experiencia en industria de belleza',
    'Inversión mínima: $100,000 USD',
    'Ubicación premium en ciudad de interés',
    'Capacidad de contratar personal calificado',
    'Recomendable: Socio con experiencia en servicios de belleza'
  ]

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <AnimatedLogo />
          <h1>Franquicias</h1>
          <h2>Anchor:23</h2>
          <p className="hero-text">
            Una oportunidad exclusiva para llevar el estándar Anchor:23 a tu ciudad.
          </p>
          <div className="hero-actions">
            <a href="#modelo" className="btn-secondary">Nuestro Modelo</a>
            <a href="#solicitud" className="btn-primary">Solicitar Información</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50">
            <span className="text-gray-500 text-lg">Imagen Hero Franquicias</span>
          </div>
        </div>
      </section>

      <section className="foundation" id="modelo">
        <article>
          <h3>Modelo de Negocio</h3>
          <h4>Una sucursal por ciudad</h4>
          <p>
            A diferencia de modelos masivos, creemos en la exclusividad geográfica. 
            Cada ciudad tiene una sola ubicación Anchor:23, garantizando calidad 
            consistente y demanda sostenible.
          </p>
        </article>

        <aside className="foundation-image">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Modelo Franquicias</span>
          </div>
        </aside>
      </section>

      <section className="services-preview">
        <h3>Beneficios y Requisitos</h3>
        <div className="service-cards">
          <article className="service-card">
            <h4>Beneficios</h4>
            <ul className="list-disc list-inside space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </article>

          <article className="service-card">
            <h4>Requisitos</h4>
            <ul className="list-disc list-inside space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="flex justify-center">
          <a href="#solicitud" className="btn-primary">Solicitar Información</a>
        </div>
      </section>

      <section className="testimonials" id="solicitud">
        <h3>Solicitud de Información</h3>
        <div className="max-w-2xl mx-auto">
          <WebhookForm
            formType="franchise"
            title="Franquicias"
            successMessage="Solicitud Enviada"
            successSubtext="Gracias por tu interés. Revisaremos tu perfil y te contactaremos pronto para discutir las oportunidades disponibles."
            submitButtonText="Enviar Solicitud"
            fields={[
              {
                name: 'nombre',
                label: 'Nombre Completo',
                type: 'text',
                required: true,
                placeholder: 'Tu nombre'
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'tu@email.com'
              },
              {
                name: 'telefono',
                label: 'Teléfono',
                type: 'tel',
                required: true,
                placeholder: '+52 844 123 4567'
              },
              {
                name: 'ciudad',
                label: 'Ciudad de Interés',
                type: 'text',
                required: true,
                placeholder: 'Ej. Monterrey, Guadalajara'
              },
              {
                name: 'experiencia',
                label: 'Experiencia en el Sector',
                type: 'select',
                required: true,
                placeholder: 'Selecciona una opción',
                options: [
                  { value: 'sin-experiencia', label: 'Sin experiencia' },
                  { value: '1-3-anos', label: '1-3 años' },
                  { value: '3-5-anos', label: '3-5 años' },
                  { value: '5-10-anos', label: '5-10 años' },
                  { value: 'mas-10-anos', label: 'Más de 10 años' }
                ]
              },
              {
                name: 'mensaje',
                label: 'Mensaje Adicional',
                type: 'textarea',
                required: false,
                rows: 4,
                placeholder: 'Cuéntanos sobre tu interés o preguntas'
              }
            ]}
          />
        </div>

        <div className="flex justify-center mt-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">
              ¿Tienes Preguntas Directas?
            </h3>
            <p className="text-gray-300 mb-8 text-center">
              Nuestro equipo de franquicias está disponible para resolver tus dudas.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <span>franchises@anchor23.mx</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6" />
                <span>+52 844 987 6543</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
