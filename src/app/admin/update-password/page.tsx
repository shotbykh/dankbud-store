"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
    } else {
      setMessage("Success! Password updated.");
      setTimeout(() => {
          router.push("/admin/login");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-md w-full border-4 border-[#facc15]">
        <h1 className="text-2xl font-black uppercase mb-4">Set New Password</h1>
        
        {message && (
            <div className={}>
                {message}
            </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
            <input 
                type="password" 
                required
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border-2 border-black p-3 font-mono"
            />
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-black text-[#facc15] font-black uppercase hover:bg-[#d946ef] hover:text-white"
            >
                {loading ? "Updating..." : "Save Password"}
            </button>
        </form>
      </div>
    </div>
  );
}
