'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Client-side Supabase
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            // Auth Success
            // We also need to fetch the Member profile to store in local storage 
            // (Legacy support for cart/checkout code that relies on 'dankbud-session')
            // Ideally, we refactor everything to use supabase.auth.getUser(), but for now double-write is safe.

            const { data: member } = await supabase
                .from('members')
                .select('*')
                .eq('id', data.user.id) // Supabase ID matches Member ID
                .single();

            if (member) {
                localStorage.setItem("dankbud-session", JSON.stringify(member));
                localStorage.setItem("dankbud-age-verified", "true");
            } else {
                console.warn("Member profile not found for auth user");
            }

            router.push("/shop");
            router.refresh(); // Refresh to update server components (middleware)

        } catch (err: any) {
            setError(err.message || "Connection failed.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#facc15] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Bg elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-black rounded-full mix-blend-multiply filter blur-xl animate-bounce" />

            <div className="w-full max-w-md bg-white/50 backdrop-blur border-4 border-black p-8 z-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-center text-black">
                    Member Access
                </h1>

                {error && (
                    <div className="bg-black text-[#facc15] p-3 mb-6 font-bold uppercase text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xl font-black uppercase text-black">Email</label>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-black p-3 text-xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5"
                            placeholder="ENTER EMAIL"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="block text-xl font-black uppercase text-black">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold uppercase underline hover:text-purple-600">
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-black p-3 text-xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5"
                            placeholder="******"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-[#facc15] text-2xl font-black uppercase tracking-widest border-4 border-black hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {loading ? "VERIFYING..." : "ENTER CLUB"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <Link href="/signup" className="block text-sm font-bold uppercase tracking-widest underline hover:text-white">
                        Not a member? Sign Up
                    </Link>
                    <Link href="/" className="block text-sm font-bold uppercase tracking-widest text-black/60 hover:text-black">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
