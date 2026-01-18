'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import formbricks from '@formbricks/js'

const FORMBRICKS_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID || ''
const FORMBRICKS_API_HOST = process.env.NEXT_PUBLIC_FORMBRICKS_API_HOST || 'https://app.formbricks.com'

export function FormbricksProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && FORMBRICKS_ENVIRONMENT_ID) {
      formbricks.init({
        environmentId: FORMBRICKS_ENVIRONMENT_ID,
        apiHost: FORMBRICKS_API_HOST
      })
    }
  }, [])

  useEffect(() => {
    formbricks?.registerRouteChange()
  }, [pathname, searchParams])

  return null
}
