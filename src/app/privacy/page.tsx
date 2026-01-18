export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-20 font-sans max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8">PRIVACY POLICY</h1>
      <p className="mb-4">Last Updated: January 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
        <p>We collect your name, email, phone number, and ID number solely for membership verification and order fulfillment.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. How We Use It</h2>
        <p>Your data is used to process orders and communicate regarding your membership. We do NOT share your data with third parties, except for our payment processor (Yoco).</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
        <p>We use industry-standard encryption (including bcrypt hashing for passwords) to protect your account.</p>
      </section>
    </div>
  );
}
