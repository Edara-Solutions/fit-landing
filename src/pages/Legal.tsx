import { useEffect, useState } from 'react';
import { SITE_CONTACT } from '../config/contact';

const SECTIONS = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'shipping', label: 'Shipping & Returns' },
];

export default function Legal() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.15, 0.35, 0.6] },
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 pb-48">
      <header className="mb-20 border-b-2 border-zinc-900 pb-12">
        <h1 className="break-words text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">Legal Documentation</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Last Updated: May 24, 2026</p>
      </header>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Sticky Nav */}
        <aside className="md:w-1/4 flex-shrink-0">
          <nav className="sticky top-32 flex flex-col gap-4">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`border-l-2 py-2 pl-6 text-xs font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-zinc-600 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {section.label}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <article className="md:w-3/4 space-y-24">
          <section id="privacy" className="scroll-mt-32">
            <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Privacy Policy</h2>
            <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">1. Information We Collect</h3>
                <p>We collect information you provide directly to us when you create an account, place an order, save an address, upload payment proof, contact support, or use our website. This may include your name, email, phone number, delivery address, order details, payment method, payment proof details, and messages you send to us.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">2. How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-4">
                  <li>Process orders, payments, delivery, returns, and customer support requests.</li>
                  <li>Verify payment proof and protect against fraud, misuse, and unauthorized account access.</li>
                  <li>Send order updates, delivery updates, account messages, and service communications.</li>
                  <li>Improve our website, product availability, customer experience, and internal operations.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">3. Data Security</h3>
                <p>We use reasonable technical and organizational measures to protect customer information from unauthorized access, loss, misuse, or disclosure. No online system is completely secure, so customers should keep account credentials private and contact us if they suspect unauthorized activity.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">4. Sharing Information</h3>
                <p>We may share only the information needed with delivery companies, payment review teams, service providers, and legal or regulatory authorities when required by applicable Egyptian law or necessary to complete your order.</p>
              </div>
            </div>
          </section>

          <section id="terms" className="scroll-mt-32">
            <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Terms of Service</h2>
            <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">1. Acceptance of Terms</h3>
                <p>By using this website, creating an account, or placing an order, you agree to these Terms of Service. If you do not agree, please do not use the website or place an order. We may update these terms from time to time, and the latest version will apply once published.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">2. Orders and Payment</h3>
                <p>Orders are subject to product availability, accurate customer information, successful payment proof review, and delivery coverage inside Egypt. Manual payment methods may require a minimum deposit and proof upload before order confirmation.</p>
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm mb-4 tracking-wider">3. User Conduct</h3>
                <p>You agree to use the website only for lawful purposes and not to misuse the service, submit false payment information, attempt unauthorized access, interfere with website security, or place fraudulent orders.</p>
              </div>
              <div className="bg-zinc-900/50 p-8 border-l-4 border-primary">
                <p className="text-white font-black uppercase text-sm mb-3">Important Notice Regarding Supplements</p>
                <p className="text-xs text-zinc-500">Supplements are not medicines and are not intended to diagnose, treat, cure, or prevent any disease. Product information is provided for general nutrition and fitness purposes. Customers should read labels carefully and consult a qualified healthcare professional before use, especially in cases of pregnancy, chronic illness, medication use, allergy, or sensitivity to stimulants.</p>
              </div>
            </div>
          </section>

          <section id="shipping" className="scroll-mt-32">
             <h2 className="text-3xl font-black text-white uppercase border-b border-zinc-900 pb-4 mb-10">Shipping & Returns</h2>
             <div className="space-y-8 text-zinc-400 leading-relaxed font-medium">
                <p>Delivery is available inside Egypt through local shipping companies. Delivery fees are calculated at checkout based on the selected city or governorate. We currently do not offer free delivery.</p>
                <p>Estimated delivery timing may vary by courier and destination. Cairo and Giza orders usually arrive within 1-3 business days, while other governorates usually arrive within 2-5 business days.</p>
                <p>Returns are accepted within 14 days of receiving the order, provided the item is in the same condition, unused, unopened, and with its original packaging. Return delivery fees may apply unless otherwise agreed by support.</p>
                <p>To request a return, contact support on <a href={SITE_CONTACT.whatsapp.href} target="_blank" rel="noreferrer" className="font-black text-primary hover:text-white transition-colors">WhatsApp at {SITE_CONTACT.whatsapp.display}</a> with your order number, phone number, and reason for return. We will review the request and guide you through the return process with the shipping company.</p>
             </div>
          </section>
        </article>
      </div>
    </div>
  );
}
