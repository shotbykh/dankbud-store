'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const validate = () => {
        if (password.length < 6) return "Password must be at least 6 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            // 1. Update Password
            const { error: updateError } = await supabase.auth.updateUser({ password });
            
            if (updateError) throw updateError;

            // 2. Notify User via Email (Call our new API)
            await fetch('/api/auth/notify-password-change', { method: 'POST' });

            setSuccess(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                router.push("/shop"); 
            }, 3000);

        } catch (err: any) {
            setError(err.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
                <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-black uppercase mb-4">Password Reset!</h1>
                    <p className="font-mono mb-6">Your password has been securely updated. A confirmation email has been sent.</p>
                    <p className="text-sm font-bold animate-pulse">Redirecting to shop...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
            <div className="bg-white p-8 border-4 border-black max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-3xl font-black uppercase text-center mb-6">Reset Password</h1>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-800 p-3 font-bold text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block font-bold uppercase text-xs mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none transition-colors"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-xs mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none transition-colors"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-[#facc15] text-xl font-black uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-2 border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Securing...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
