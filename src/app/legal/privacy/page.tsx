export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12 font-mono">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-[#facc15] uppercase mb-8">Privacy Policy</h1>

                <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">1. Commitment to POPIA</h2>
                        <p>
                            DankBud ("The Club") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA). We collect only what is necessary to administer your membership and facilitate Club operations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Identity Data:</strong> Full name, SA ID Number (strictly for age verification and membership legality).</li>
                            <li><strong>Contact Data:</strong> Email address, mobile number.</li>
                            <li><strong>Delivery Data:</strong> Physical address or PUDO locker preferences.</li>
                            <li><strong>Usage Data:</strong> Order history and preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">3. How We Use Your Data</h2>
                        <p>We use your data strictly for:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Verifying that you are Over 18 (Legal Requirement).</li>
                            <li>Processing your Club contributions and allocating harvest.</li>
                            <li>Facilitating delivery via our logistics partners (e.g., PUDO/Couriers).</li>
                            <li>Communicating Club updates, harvest drops, and status alerts.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">4. Data Sharing & Third Parties</h2>
                        <p>
                            <strong>We do NOT sell your data.</strong> We only share necessary data with service providers required to fulfill our obligations to you:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Logistics:</strong> Courier Guy / PUDO (for delivery purposes only).</li>
                            <li><strong>Payments:</strong> Payment Gateway (Yoco) for secure processing.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">5. Data Security</h2>
                        <p>
                            We employ industry-standard encryption and security measures (including secure database storage and Row Level Security) to protect your information from unauthorized access via Supabase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">6. Your Rights</h2>
                        <p>
                            You have the right to request access to your data, correction of errors, or deletion of your account (subject to legal retention requirements). Contact our Admin for any POPIA requests.
                        </p>
                    </section>
                </div>

                <div className="pt-8 border-t border-white/20">
                    <p className="text-xs text-gray-500">Last Updated: January 2026</p>
                </div>
            </div>
        </div>
    );
}

