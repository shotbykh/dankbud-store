'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        // Skip if already on reset-password page
        if (pathname === '/reset-password') return;

        // Check for hash-based tokens (Supabase implicit flow)
        const hash = window.location.hash;
        if (!hash) return;

        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Handle password reset (recovery) flow
        if (accessToken && type === 'recovery') {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
            }).then(({ error }) => {
                if (!error) {
                    // Clear the hash and redirect to reset password
                    window.history.replaceState(null, '', window.location.pathname);
                    router.push('/reset-password');
                } else {
                    console.error('Failed to set session:', error);
                }
            });
        }
    }, [pathname, router]);

    return null; // This component doesn't render anything
}
