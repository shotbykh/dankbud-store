export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-20 font-sans max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8">REFUND & RETURN POLICY</h1>
      <p className="mb-4">Last Updated: January 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Perishable Goods</h2>
        <p>Due to the nature of our products, we generally cannot accept returns on opened items unless they are defective.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Defective Products</h2>
        <p>If you receive a defective or incorrect item, please notify us within 24 hours of delivery. We will arrange a replacement or refund.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Refunds</h2>
        <p>Approved refunds will be processed back to your original payment method via Yoco within 5-7 business days.</p>
      </section>
    </div>
  );
}
