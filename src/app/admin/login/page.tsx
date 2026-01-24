"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Success! Middleware will handle the session check on next navigation.
      router.push("/admin");
      router.refresh();

    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 max-w-md w-full border-4 border-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.3)]">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-archivo uppercase text-black">Staff Portal</h1>
            <p className="font-mono text-sm text-gray-500 mt-2">DankBud Backoffice (Secure)</p>
        </div>

        {error && (
            <div className="bg-red-500 text-white p-3 font-bold mb-6 text-center animate-pulse">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block font-bold uppercase text-xs mb-1">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none transition-colors"
                />
            </div>

            <div>
                <label className="block font-bold uppercase text-xs mb-1">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none transition-colors"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-black text-[#facc15] text-xl font-black uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-2 border-transparent"
            >
                {loading ? "Verifying..." : "Access Console"}
            </button>
        </form>
      </div>
    </div>
  );
}
