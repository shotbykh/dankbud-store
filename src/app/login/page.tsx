'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });
        
        const data = await res.json();

        if (!data.success) {
            setError(data.message);
            setLoading(false);
            return;
        }

        // Login Success
        localStorage.setItem("dankbud-session", JSON.stringify(data.member));
        localStorage.setItem("dankbud-age-verified", "true");
        router.push("/shop");

    } catch (err) {
        setError("Connection failed.");
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
                    <label className="block text-xl font-black uppercase text-black">Email or ID Number</label>
                    <input 
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-transparent border-b-4 border-black p-3 text-xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5"
                        placeholder="ENTER CREDENTIALS"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xl font-black uppercase text-black">Password</label>
                    <input 
                        type="password"
                        value={password}
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
                <Link href="/apply" className="block text-sm font-bold uppercase tracking-widest underline hover:text-white">
                    Not a member? Apply Access
                </Link>
                <Link href="/" className="block text-sm font-bold uppercase tracking-widest text-black/60 hover:text-black">
                    ← Back to Home
                </Link>
            </div>
       </div>
    </main>
  );
}
