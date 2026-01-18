'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { getDeviceType, sendWebhookPayload } from '@/lib/webhook'

interface WebhookFormProps {
  formType: 'contact' | 'franchise' | 'membership'
  title: string
  successMessage?: string
  successSubtext?: string
  submitButtonText?: string
  fields: {
    name: string
    label: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
    required?: boolean
    placeholder?: string
    options?: { value: string; label: string }[]
    rows?: number
  }[]
  additionalData?: Record<string, string>
}

export function WebhookForm({
  formType,
  title,
  successMessage = 'Mensaje Enviado',
  successSubtext = 'Gracias por contactarnos. Te responderemos lo antes posible.',
  submitButtonText = 'Enviar',
  fields,
  additionalData
}: WebhookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const formData = fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: '' }),
    {} as Record<string, string>
  )

  const [values, setValues] = useState(formData)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const payload = {
      form: formType,
      ...values,
      timestamp_utc: new Date().toISOString(),
      device_type: getDeviceType(),
      ...additionalData
    }

    try {
      await sendWebhookPayload(payload)
      setSubmitted(true)
      setShowThankYou(true)
      window.setTimeout(() => setShowThankYou(false), 3500)
      setValues(formData)
    } catch (error) {
      setSubmitError('No pudimos enviar tu solicitud. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">¡Gracias!</h3>
            <p className="text-gray-600">{successSubtext}</p>
          </div>
        </div>
      )}

      {submitted ? (
        <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-12 h-12 text-green-900 mb-4 mx-auto" />
          <h4 className="text-xl font-semibold text-green-900 mb-2">
            {successMessage}
          </h4>
          <p className="text-green-800">
            {successSubtext}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    rows={field.rows || 4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">{field.placeholder || 'Selecciona una opción'}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
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
            {isSubmitting ? 'Enviando...' : submitButtonText}
          </button>
        </form>
      )}
    </>
  )
}
