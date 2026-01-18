'use client'

import { AnimatedLogo } from '@/components/animated-logo'
import { RollingPhrases } from '@/components/rolling-phrases'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { WebhookForm } from '@/components/webhook-form'

/** @description Contact page component with contact information and contact form for inquiries. */
export default function ContactoPage() {

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <AnimatedLogo />
          <h1>Contacto</h1>
          <h2>Anchor:23</h2>
          <RollingPhrases />
          <div className="hero-actions">
            <a href="#informacion" className="btn-secondary">Información</a>
            <a href="#mensaje" className="btn-primary">Enviar Mensaje</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Contacto Hero</span>
          </div>
        </div>
      </section>

      <section className="foundation" id="informacion">
        <article>
          <h3>Información</h3>
          <h4>Estamos aquí para ti</h4>
          <p>
            Anchor:23 es más que un salón, es un espacio diseñado para tu transformación personal.
            Contáctanos para cualquier consulta o reserva.
          </p>
        </article>
        <aside className="foundation-image">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Contacto</span>
          </div>
        </aside>
      </section>

      <section className="services-preview">
        <h3>Información de Contacto</h3>
        <div className="service-cards">
          <article className="service-card">
            <h4>Ubicación</h4>
            <p>Saltillo, Coahuila, México</p>
          </article>
          <article className="service-card">
            <h4>Teléfono</h4>
            <p>+52 844 123 4567</p>
          </article>
          <article className="service-card">
            <h4>Email</h4>
            <p>contacto@anchor23.mx</p>
          </article>
          <article className="service-card">
            <h4>Horario</h4>
            <p>Lunes - Sábado: 10:00 - 21:00</p>
          </article>
        </div>
        <div className="flex justify-center">
          <a href="https://booking.anchor23.mx" className="btn-primary">
            Reservar Cita
          </a>
        </div>
      </section>

      <section className="testimonials" id="mensaje">
        <h3>Envíanos un Mensaje</h3>
        <div className="max-w-2xl mx-auto">
          <WebhookForm
            formType="contact"
            title="Contacto"
            successMessage="Mensaje Enviado"
            successSubtext="Gracias por contactarnos. Te responderemos lo antes posible."
            submitButtonText="Enviar Mensaje"
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
                required: false,
                placeholder: '+52 844 123 4567'
              },
              {
                name: 'motivo',
                label: 'Motivo de Contacto',
                type: 'select',
                required: true,
                placeholder: 'Selecciona un motivo',
                options: [
                  { value: 'cita', label: 'Agendar Cita' },
                  { value: 'membresia', label: 'Información Membresías' },
                  { value: 'franquicia', label: 'Interés en Franquicias' },
                  { value: 'servicios', label: 'Pregunta sobre Servicios' },
                  { value: 'pago', label: 'Problema con Pago' },
                  { value: 'resena', label: 'Enviar Reseña' },
                  { value: 'otro', label: 'Otro' }
                ]
              },
              {
                name: 'mensaje',
                label: 'Mensaje',
                type: 'textarea',
                required: true,
                rows: 6,
                placeholder: '¿Cómo podemos ayudarte?'
              }
            ]}
          />
        </div>
      </section>
    </>
  )
}
