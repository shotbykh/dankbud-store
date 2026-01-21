export default function RefundPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12 font-mono">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-[#facc15] uppercase mb-8">Returns & Refunds</h1>

                <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">1. Membership Fees</h2>
                        <p>
                            As DankBud is a private club, membership fees and contributions towards operational costs are generally <strong>non-refundable</strong> once a service (cultivation/processing) has been initiated or accessed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">2. Quality Guarantee</h2>
                        <p>
                            While we operate as a collective, we pride ourselves on premium quality. If the harvest portion allocated to you is visibly defective (e.g., mould, rot) or significantly incorrect description:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>You must notify us within <strong>48 hours</strong> of receipt.</li>
                            <li>You must provide photographic evidence of the issue.</li>
                            <li>We will arrange for a replacement allocation or credit to your member account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">3. Delivery Issues</h2>
                        <p>
                            <strong>Damaged in Transit:</strong> If your package arrives damaged, please report it immediately with photos so we can claim via our courier insurance and resupply you.
                        </p>
                        <p className="mt-2">
                            <strong>Lost Packages:</strong> If a package is confirmed lost by PUDO/The Courier Guy, we will resupply your allocation at no extra cost.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">4. Return Process</h2>
                        <p>
                            Due to the nature of the product, <strong>do not return cannabis to us via post</strong> without explicit instruction from Admin. This creates legal risk. Contact us first to resolve the issue.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-2 uppercase">5. Cooling Off Period</h2>
                        <p>
                            In terms of the ECT Act, you may cancel a transaction within 7 days of receipt of goods, provided the goods (packaging seal) remain <strong>unopened and intact</strong>. Return shipping costs are for the member's account.
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

