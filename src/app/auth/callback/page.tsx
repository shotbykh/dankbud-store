'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Suspense } from 'react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            if (typeof window === 'undefined') return;

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // PKCE Flow: Check for code in query params
            const code = searchParams.get('code');
            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        console.error('Code exchange error:', error);
                        setStatus('error');
                        setErrorMessage('Session expired. Please request a new reset link.');
                        return;
                    }
                    // Success - redirect to reset password
                    router.push('/reset-password');
                    return;
                } catch (err) {
                    console.error('Exchange error:', err);
                    setStatus('error');
                    setErrorMessage('Failed to verify your identity.');
                    return;
                }
            }

            // Implicit Flow: Check for tokens in hash
            const hash = window.location.hash;
            if (hash) {
                const hashParams = new URLSearchParams(hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const type = hashParams.get('type');

                if (accessToken) {
                    try {
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || ''
                        });

                        if (error) {
                            setStatus('error');
                            setErrorMessage('Failed to verify your identity.');
                            return;
                        }

                        window.history.replaceState(null, '', '/auth/callback');
                        
                        if (type === 'recovery') {
                            router.push('/reset-password');
                        } else {
                            router.push('/shop');
                        }
                        return;
                    } catch (err) {
                        setStatus('error');
                        setErrorMessage('An unexpected error occurred.');
                        return;
                    }
                }
            }

            // No valid auth data found
            setStatus('error');
            setErrorMessage('Invalid or expired reset link.');
        };

        handleCallback();
    }, [router, searchParams]);

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

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
                <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
                    <div className="animate-spin text-6xl mb-4">⚡</div>
                    <h1 className="text-2xl font-black uppercase mb-4">Loading...</h1>
                </div>
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
