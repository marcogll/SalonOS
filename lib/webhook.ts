export const WEBHOOK_ENDPOINTS = [
  'https://flows.soul23.cloud/webhook-test/4YZ7RPfo1GT',
  'https://flows.soul23.cloud/webhook/4YZ7RPfo1GT'
]

export const getDeviceType = () => {
  if (typeof window === 'undefined') {
    return 'unknown'
  }

  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop'
}

export const sendWebhookPayload = async (payload: Record<string, string>) => {
  const results = await Promise.allSettled(
    WEBHOOK_ENDPOINTS.map(async (endpoint) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Webhook error')
      }

      return response
    })
  )

  const hasSuccess = results.some((result) => result.status === 'fulfilled')
  if (!hasSuccess) {
    throw new Error('No se pudo enviar la solicitud a los webhooks.')
  }
}
