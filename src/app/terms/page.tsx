export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-20 font-sans max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8">TERMS OF SERVICE</h1>
      <p className="mb-4">Last Updated: January 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Membership</h2>
        <p>DankBud is a private members-only club. Access is restricted to individuals over the age of 18. By registering, you confirm you are of legal age.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Products & Pricing</h2>
        <p>All products are sold for private consumption. Prices are subject to change without notice. We reserve the right to limit quantities.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Payments</h2>
        <p>We process payments securely via Yoco. We do not store your card details.</p>
      </section>
      
       <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Returns & Refunds</h2>
        <p>Due to the nature of the product, we generally do not accept returns on opened items (See Return Policy). If a product is defective, please contact support within 24 hours.</p>
      </section>
    </div>
  );
}
