'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')

    if (access_token && refresh_token) {
      const supabase = createClient()

      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (!error) {
            router.push('/')
          } else {
            console.error('Error setting session:', error.message)
          }
        })
    }
  }, [searchParams, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-lg">Confirming your email...</p>
    </div>
  )
}
