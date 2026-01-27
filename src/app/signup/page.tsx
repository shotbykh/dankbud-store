'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        idNumber: '',
        phone: '',
        referralCode: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Signup failed.');
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Network error.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4">
                <div className="bg-white p-8 border-4 border-black max-w-md w-full text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-6xl mb-4">📧</div>
                    <h1 className="text-3xl font-black uppercase mb-4">Check Your Email</h1>
                    <p className="font-mono mb-6">We've sent a confirmation link to <span className="font-bold">{formData.email}</span>.</p>
                    <p className="font-mono text-sm text-gray-500 mb-6">Click the link in your email to activate your account and access the shop.</p>
                    <Link href="/login" className="block w-full py-4 bg-black text-[#facc15] font-bold uppercase hover:bg-white hover:text-black border-4 border-black transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#facc15] flex items-center justify-center p-4 pt-20">
            <div className="w-full max-w-lg bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-black uppercase text-black mb-2">Join the Club</h1>
                    <p className="font-mono text-sm text-gray-600">Secure Member Access</p>
                </header>

                {error && (
                    <div className="bg-red-500 text-white p-4 font-bold border-2 border-black mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold uppercase text-xs mb-1">Full Name</label>
                        <input
                            required
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            type="text"
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase text-xs mb-1">Email Address</label>
                        <input
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold uppercase text-xs mb-1">ID Number</label>
                            <input
                                required
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                type="text"
                                className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                                placeholder="SA ID"
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-xs mb-1">Phone</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                                placeholder="082 123 4567"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block font-bold uppercase text-xs mb-1">Create Password</label>
                        <input
                            required
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            minLength={6}
                            className="w-full bg-gray-100 border-2 border-black p-3 font-mono focus:bg-[#facc15] outline-none"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <div className="pt-2 bg-gradient-to-r from-purple-100 to-pink-100 p-4 border-2 border-dashed border-purple-400">
                        <label className="block font-bold uppercase text-xs mb-1 text-purple-700">🎁 Got a Referral Code? Get R50 Credit!</label>
                        <input
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            type="text"
                            maxLength={6}
                            className="w-full bg-white border-2 border-purple-400 p-3 font-mono focus:bg-purple-50 outline-none uppercase text-center tracking-widest"
                            placeholder="XXXXXX"
                        />
                    </div>

                    <p className="text-xs text-gray-500 font-mono text-center pt-2">
                        By joining you verify you are 18+ and agree to our <Link href="/terms" className="underline">Terms</Link>.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-black text-[#facc15] text-2xl font-black uppercase hover:bg-[#d946ef] hover:text-white transition-colors border-4 border-transparent hover:border-black mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-bold uppercase underline hover:text-purple-600">
                        Already a member? Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
