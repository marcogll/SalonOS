# Stripe Payment Integration

## Current Status
Stripe is currently **DISABLED** using mock payment mode for testing.

## To Enable Real Stripe Payments

### 1. Update Environment Variables

In `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_test_your_real_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_real_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_real_webhook_secret
```

### 2. Replace Mock Payment with Real Stripe

In `app/booking/cita/page.tsx`:

Replace the `MockPaymentForm` component usage with real Stripe integration:

```tsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

// Replace the mock payment section with:
<CardElement
  options={{
    style: {
      base: {
        fontSize: '16px',
        color: 'var(--charcoal-brown)',
        '::placeholder': {
          color: 'var(--mocha-taupe)',
        },
      },
    },
  }}
/>
```

### 3. Update Payment Handling

Replace the `handleMockPayment` function with real Stripe confirmation:

```tsx
const handlePayment = async () => {
  if (!stripe || !elements) return

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    paymentIntent.clientSecret,
    {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    }
  )

  if (error) {
    // Handle error
  } else {
    // Payment succeeded, create booking
  }
}
```

### 4. Update Create Payment Intent API

Ensure `/api/create-payment-intent` uses your real Stripe secret key.

## Mock Payment Mode

Currently using `components/booking/mock-payment-form.tsx` for testing without real payments. This validates card formatting and simulates payment flow.