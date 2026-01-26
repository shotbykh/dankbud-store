'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            // Only run on client side
            if (typeof window === 'undefined') return;

            const hash = window.location.hash;
            if (!hash) {
                setStatus('error');
                setErrorMessage('No authentication data found.');
                return;
            }

            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');

            if (!accessToken) {
                setStatus('error');
                setErrorMessage('Invalid reset link. Please request a new one.');
                return;
            }

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            try {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || ''
                });

                if (error) {
                    console.error('Session error:', error);
                    setStatus('error');
                    setErrorMessage('Failed to verify your identity. Please try again.');
                    return;
                }

                // Clear the hash from URL for security
                window.history.replaceState(null, '', '/auth/callback');

                // Handle password reset flow
                if (type === 'recovery') {
                    router.push('/reset-password');
                } else {
                    // Default redirect for other auth flows
                    router.push('/shop');
                }
            } catch (err) {
                console.error('Callback error:', err);
                setStatus('error');
                setErrorMessage('An unexpected error occurred.');
            }
        };

        handleCallback();
    }, [router]);

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
                <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-black uppercase mb-4">Error</h1>
                    <p className="font-mono mb-6">{errorMessage}</p>
                    <a 
                        href="/forgot-password" 
                        className="block w-full py-4 bg-black text-[#facc15] font-bold uppercase hover:bg-[#d946ef] hover:text-white transition-colors text-center"
                    >
                        Try Again
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
            <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
                <div className="animate-spin text-6xl mb-4">⚡</div>
                <h1 className="text-2xl font-black uppercase mb-4">Verifying...</h1>
                <p className="font-mono">Please wait while we verify your identity.</p>
            </div>
        </div>
    );
}
