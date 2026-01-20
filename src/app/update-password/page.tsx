'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setError(error.message);
            } else {
                router.push("/shop"); // Or dedicated success page
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
                <h1 className="text-3xl font-black uppercase text-center mb-6">New Password</h1>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-800 p-3 font-bold text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block font-bold uppercase text-xs mb-1">Set New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-[#facc15] text-xl font-black uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-2 border-transparent disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
