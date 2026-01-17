import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'

interface MockPaymentFormProps {
  amount: number
  onSubmit: (paymentMethod: any) => Promise<void>
  disabled?: boolean
}

export default function MockPaymentForm({ amount, onSubmit, disabled }: MockPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (cardNumber.length < 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido'
    }

    if (expiry.length < 5) {
      newErrors.expiry = 'Fecha de expiración inválida'
    }

    if (cvc.length < 3) {
      newErrors.cvc = 'CVC inválido'
    }

    if (!name.trim()) {
      newErrors.name = 'Nombre requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry,
        cvc,
        name,
        type: 'card'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    if (formatted.length <= 5) {
      setExpiry(formatted)
    }
  }

  return (
    <div className="p-6 rounded-xl" style={{ background: 'var(--bone-white)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4" style={{ color: 'var(--mocha-taupe)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--charcoal-brown)' }}>
          Pago Seguro (Demo Mode)
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal-brown)' }}>
            Número de Tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              disabled={disabled || loading}
              className="w-full px-4 py-3 border rounded-lg pr-12"
              style={{ borderColor: errors.cardNumber ? '#ef4444' : 'var(--mocha-taupe)' }}
            />
            <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--mocha-taupe)' }} />
          </div>
          {errors.cardNumber && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal-brown)' }}>
              Expiración (MM/AA)
            </label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="12/28"
              disabled={disabled || loading}
              className="w-full px-4 py-3 border rounded-lg"
              style={{ borderColor: errors.expiry ? '#ef4444' : 'var(--mocha-taupe)' }}
            />
            {errors.expiry && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.expiry}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal-brown)' }}>
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123"
              disabled={disabled || loading}
              className="w-full px-4 py-3 border rounded-lg"
              style={{ borderColor: errors.cvc ? '#ef4444' : 'var(--mocha-taupe)' }}
            />
            {errors.cvc && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.cvc}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal-brown)' }}>
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="MARÍA GARCÍA"
            disabled={disabled || loading}
            className="w-full px-4 py-3 border rounded-lg uppercase"
            style={{ borderColor: errors.name ? '#ef4444' : 'var(--mocha-taupe)' }}
          />
          {errors.name && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
        </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: 'var(--charcoal-brown)', opacity: 0.7 }}>
            Total a pagar
          </span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--charcoal-brown)' }}>
            ${amount.toFixed(2)} USD
          </span>
        </div>

        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full px-6 py-4 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--deep-earth)' }}
        >
          {loading ? 'Procesando...' : 'Pagar y Confirmar Reserva'}
        </button>

        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(111, 94, 79, 0.1)', border: '1px solid var(--mocha-taupe)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--charcoal-brown)', opacity: 0.8 }}>
            <Lock className="inline w-3 h-3 mr-1" />
            <span className="font-medium">Modo de prueba:</span> Este es un formulario de demostración. No se procesará ningún pago real.
          </p>
          <p className="text-xs text-center mt-1" style={{ color: 'var(--charcoal-brown)', opacity: 0.6 }}>
            Consulta STRIPE_SETUP.md para activar pagos reales
          </p>
        </div>
      </div>
      </form>
    </div>
  )
}