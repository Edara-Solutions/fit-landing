import { motion } from 'motion/react';

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 pb-48">
      <header className="mb-20 border-b-2 border-zinc-900 pb-12">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">Legal Documentation</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Last Updated: October 24, 2024</p>
      </header>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Sticky Nav */}
        <aside className="md:w-1/4 flex-shrink-0">
          <nav className="sticky top-32 flex flex-col gap-4">
            <a href="#privacy" className="text-primary font-black uppercase tracking-widest text-xs border-l-2 border-primary pl-6 py-2 transition-all">Privacy Policy</a>
            <a href="#terms" className="text-zinc-600 hover:text-white font-black uppercase tracking-widest text-xs border-l-2 border-transparent pl-6 py-2 transition-all">Terms of Service</a>
            <a href="#shipping" className="text-zinc-600 hover:text-white font-black uppercase tracking-widest text-xs border-l-2 border-transparent pl-6 py-2 transition-all">Shipping & Returns</a>
          </nav>
        </aside>

        {/* Content */}
        <article className="md:w-3/4 space-y-24">
          <section id="privacy" className="scroll-mt-32">
            <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Privacy Policy</h2>
            <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, and other info you provide.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">2. How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-4">
                  <li>Provide, maintain, and improve our high-performance services.</li>
                  <li>Perform internal operations, including fraud prevention and safety features.</li>
                  <li>Send or facilitate communications between you and HQ.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">3. Data Security</h3>
                <p>We implement reasonable security measures designed to protect your information from unauthorized access. However, no security system is 100% impenetrable. We stand for transparency in our protection as much as our ingredients.</p>
              </div>
            </div>
          </section>

          <section id="terms" className="scroll-mt-32">
            <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Terms of Service</h2>
            <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">1. Acceptance of Terms</h3>
                <p>By accessing and using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our mission-critical services. We reserve the right to update these terms at any time.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">2. User Conduct</h3>
                <p>You agree to use our services only for lawful purposes in pursuit of your fitness goals. You are prohibited from violating or attempting to violate the security of the services or accessing data not intended for you.</p>
              </div>
              <div className="bg-zinc-900/50 p-8 border-l-4 border-primary">
                <p className="text-white font-black uppercase text-sm mb-3">Important Notice Regarding Supplements</p>
                <p className="text-xs text-zinc-500">The products and claims made about specific products on or through this Site have not been evaluated by the United States Food and Drug Administration and are not approved to diagnose, treat, cure or prevent disease.</p>
              </div>
            </div>
          </section>

          <section id="shipping" className="scroll-mt-32">
             <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Shipping & Returns</h2>
             <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
                <p>Our commitment to high performance extends to our shipping and return policies. We process all orders within 24 hours. Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout.</p>
                <p>If you are not completely satisfied with your purchase, you may return unopened products within 30 days of delivery for a full refund. Please contact our support team to initiate a return process.</p>
             </div>
          </section>
        </article>
      </div>
    </div>
  );
}
