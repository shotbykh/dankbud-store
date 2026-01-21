export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12 font-mono">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-[#facc15] uppercase mb-8">Terms of Service</h1>

                <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">1. Introduction & Legal Status</h2>
                        <p>
                            DankBud (hereinafter "The Club") is a <strong>Private Cannabis Social Club</strong> operating in accordance with the constitutional right to privacy as affirmed by the Constitutional Court of South Africa (Prince v Minister of Justice and Constitutional Development).
                        </p>
                        <p className="mt-2">
                            <strong>Important:</strong> We do not sell cannabis. The Club facilitates the collective cultivation and sharing of cannabis for the <strong>personal, private use</strong> of its members. All fees paid are contributions towards operational costs (horticulture, administration, facilities), not payments for the purchase of cannabis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">2. Membership Requirements</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must be at least <strong>18 years of age</strong>. We strictly enforce age verification.</li>
                            <li>You must be a resident of South Africa.</li>
                            <li>You must attest that you are an existing cannabis consumer.</li>
                            <li>Membership is personal and non-transferable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">3. Member Code of Conduct</h2>
                        <p>By joining The Club, you agree to:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Use any cannabis obtained via The Club strictly for <strong>personal, private consumption</strong>.</li>
                            <li><strong>NEVER resell, distribute, or trade</strong> Club cannabis to non-members or minors. Doing so is illegal and will result in immediate ban and reporting.</li>
                            <li>Consume responsibly and privately. Do not consume in public spaces.</li>
                            <li>Respect the privacy and anonymity of other members.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">4. Contribution Model</h2>
                        <p>
                            "Prices" listed on our platform represent the cost-sharing contribution required to allocate a portion of the Club's collective harvest to you. This includes expert cultivation, processing, storage, and logistics.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">5. Limitation of Liability</h2>
                        <p>
                            The Club operates within a complex legal framework. While we strive to operate strictly within the bounds of the "Private Club" model, laws are subject to interpretation.
                        </p>
                        <p className="mt-2">
                            Members utilize Club services at their own risk. You hereby indemnify The Club, its administrators, and staff against any legal prosecution, claims, or damages arising from your possession or use of cannabis, or your breach of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">6. Termination</h2>
                        <p>
                            The Club reserves the Right of Admission. We may terminate your membership immediately without refund if you violate these Terms, specifically regarding resale or providing cannabis to minors.
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

