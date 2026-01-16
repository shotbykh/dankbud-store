'use client';
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    return (
        <button 
            onClick={() => { localStorage.removeItem("dankbud-session"); router.push("/"); }}
            className="underline hover:bg-black hover:text-[#facc15] px-2"
        >
            Log Out
        </button>
    );
}
