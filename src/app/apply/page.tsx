'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormData } from "@/lib/schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    defaultValues: {
        idType: "SA_ID"
    }
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
        const res = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await res.json();

        if (!res.ok) {
            setServerError(result.error || result.message || "Server Error: " + res.status);
            setIsSubmitting(false);
            return;
        }

        // SUCCESS: Auto-Login & Redirect
        localStorage.setItem("dankbud-session", JSON.stringify(result.member));
        localStorage.setItem("dankbud-age-verified", "true"); 

        router.push('/shop?welcome=true');

    } catch (error) {
        setServerError("Failed to connect to server.");
        setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#facc15] flex flex-col relative overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 md:p-8 mix-blend-darken pointer-events-none">
        <Link href="/" className="text-4xl font-black uppercase tracking-tighter hover:scale-105 transition-transform pointer-events-auto">
          DankBud
        </Link>
        <div className="text-sm font-bold uppercase tracking-widest border-2 border-black px-4 py-1 rounded-full pointer-events-auto">
            Instant Access
        </div>
      </header>

      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-20 right-0 w-[50vw] h-[50vw] bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-[#ec4899] rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-20 z-10 w-full">
        <div className="w-full max-w-2xl bg-white/50 backdrop-blur-md border-4 border-black p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 text-black">
            
            <div className="space-y-8">
                <div className="space-y-2 text-center border-b-4 border-black pb-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                        Join The <br/> Club
                    </h1>
                    {/* Removed Wholesale Pricing Text */}
                    {serverError && (
                        <div className="bg-red-500 text-white font-bold p-4 uppercase border-2 border-black animate-pulse">
                            ⚠️ {serverError}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* FULL NAME */}
                    <div className="space-y-2">
                        <label className="block text-xl font-black uppercase">Full Name</label>
                        <input 
                            {...register("fullName")}
                            className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors"
                            placeholder="JOHNNY DANKSEED"
                        />
                        {errors.fullName && <p className="text-red-600 font-bold uppercase text-sm">{errors.fullName.message}</p>}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label className="block text-xl font-black uppercase">Email Address</label>
                        <input 
                            {...register("email")}
                            type="email"
                            className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors"
                            placeholder="YOU@EXAMPLE.COM"
                        />
                        {errors.email && <p className="text-red-600 font-bold uppercase text-sm">{errors.email.message}</p>}
                    </div>

                    {/* PASSWORD FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xl font-black uppercase">Password</label>
                            <input 
                                {...register("password")}
                                type="password"
                                className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors"
                                placeholder="******"
                            />
                            {errors.password && <p className="text-red-600 font-bold uppercase text-sm">{errors.password.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <label className="block text-xl font-black uppercase">Confirm Password</label>
                            <input 
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors"
                                placeholder="******"
                            />
                            {errors.confirmPassword && <p className="text-red-600 font-bold uppercase text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    {/* PHONE */}
                    <div className="space-y-2">
                        <label className="block text-xl font-black uppercase">Phone No.</label>
                        <input 
                            {...register("phone")}
                            type="tel"
                            className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors"
                            placeholder="082 123 4567"
                        />
                        {errors.phone && <p className="text-red-600 font-bold uppercase text-sm">{errors.phone.message}</p>}
                    </div>
                    
                    {/* ID TYPE Selection */}
                    <div className="space-y-4">
                        <label className="block text-xl font-black uppercase">Identity Document</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border-4 border-black p-4 text-center font-bold uppercase transition-all ${watch('idType') !== 'PASSPORT' ? 'bg-black text-[#facc15]' : 'bg-transparent opacity-50 hover:opacity-100'}`}>
                                <input 
                                    type="radio" 
                                    value="SA_ID" 
                                    className="hidden" 
                                    {...register("idType")} 
                                />
                                🇿🇦 SA ID
                            </label>
                            <label className={`flex-1 cursor-pointer border-4 border-black p-4 text-center font-bold uppercase transition-all ${watch('idType') === 'PASSPORT' ? 'bg-black text-[#facc15]' : 'bg-transparent opacity-50 hover:opacity-100'}`}>
                                <input 
                                    type="radio" 
                                    value="PASSPORT" 
                                    className="hidden" 
                                    {...register("idType")} 
                                />
                                🌍 Passport
                            </label>
                        </div>
                    </div>

                    {/* ID NUMBER INPUT */}
                    <div className="space-y-2">
                        <label className="block text-xl font-black uppercase flex justify-between items-center">
                            <span>{watch('idType') === 'PASSPORT' ? 'Passport Number' : 'SA ID Number'}</span> 
                            <span className="text-xs bg-black text-[#facc15] px-2 py-1 rounded">STRICT</span>
                        </label>
                        <input 
                            {...register("idNumber", {
                                onChange: (e) => {
                                    if(watch('idType') !== 'PASSPORT') {
                                       e.target.value = e.target.value.replace(/\D/g, ''); 
                                    } else {
                                       e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                    }
                                }
                            })}
                            className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors tracking-widest"
                            placeholder={watch('idType') === 'PASSPORT' ? "A12345678" : "YYMMDDSSSSCAZ"}
                            maxLength={watch('idType') === 'PASSPORT' ? 20 : 13}
                        />
                        {errors.idNumber && <p className="text-red-600 font-bold uppercase text-sm">{errors.idNumber.message}</p>}
                    </div>

                    {/* DATE OF BIRTH (CONDITIONAL FOR PASSPORT) */}
                    {watch('idType') === 'PASSPORT' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                            <label className="block text-xl font-black uppercase">Date of Birth</label>
                            <input 
                                type="date"
                                {...register("dateOfBirth")}
                                className="w-full bg-transparent border-b-4 border-black p-4 text-2xl font-bold placeholder-black/30 focus:outline-none focus:bg-black/5 transition-colors uppercase"
                            />
                             {errors.dateOfBirth && <p className="text-red-600 font-bold uppercase text-sm">{errors.dateOfBirth.message}</p>}
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <div className="pt-8">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full h-20 bg-black text-[#facc15] text-3xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">{isSubmitting ? "PROCESSING..." : "JOIN CLUB"}</span>
                            {/* Background fill animation */}
                            {!isSubmitting && <div className="absolute inset-0 w-full h-full bg-[#facc15] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                        </button>
                    </div>

                    <div className="text-center font-bold uppercase text-sm">
                        Already a member? <Link href="/login" className="underline hover:text-white">Login Here</Link>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </main>
  );
}
