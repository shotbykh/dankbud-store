'use client';

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Check your email for the password reset link.");
            }
        } catch (err: any) {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
            <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-3xl font-black uppercase text-center mb-6">Reset Password</h1>

                {message ? (
                    <div className="text-center">
                        <div className="bg-green-100 border-2 border-green-500 text-green-800 p-4 mb-6 font-bold">
                            {message}
                        </div>
                        <Link href="/login" className="block w-full py-4 bg-black text-[#facc15] font-bold uppercase hover:bg-white hover:text-black border-4 border-black transition-colors text-center">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        {error && (
                            <div className="bg-red-100 border-2 border-red-500 text-red-800 p-3 font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block font-bold uppercase text-xs mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-[#facc15] text-xl font-black uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-2 border-transparent disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <Link href="/login" className="block text-center text-sm font-bold uppercase underline hover:text-gray-600">
                            Cancel
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
