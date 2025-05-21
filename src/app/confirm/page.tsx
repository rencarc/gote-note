'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseBrowser'; // ✅ 注意这里变量名是 supabase

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (!error) {
            router.push('/');
          } else {
            console.error('Error setting session:', error.message);
          }
        });
    }
  }, [router, searchParams]);

  return null;
}

