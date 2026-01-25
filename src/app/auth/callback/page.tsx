'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Handle hash-based tokens (implicit flow for password reset)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (accessToken && type === 'recovery') {
            // Set the session from the hash tokens
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: hashParams.get('refresh_token') || ''
            }).then(() => {
                // Redirect to reset password page
                router.push('/reset-password');
            });
        } else {
            // Fallback to homepage if no valid tokens
            router.push('/');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#facc15] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-black uppercase mb-4">Processing...</h1>
                <p className="font-mono">Redirecting you now.</p>
            </div>
        </div>
    );
}
