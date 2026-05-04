import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PRODUCTS } from '../constants';

export default function Stacks() {
  const navigate = useNavigate();
  const stacks = PRODUCTS.filter(p => p.category === 'stacks');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_w8SGhu1zUhcuhiKDBDW0_ywTxO2VzKJ1RZWRLM9dFSOuBiH6406eoc2qItpVkB0Xdqtbp2huouKveGgRFPROCbr6gKQQSCRXL3H305ClXYHy8UvSm5Gq1Pw9mzE12fOPgijvHH6fP1tv4ec9DpSeyEzF6N3zjIK3dMJKUQfp8MeOJ9baqxbCm3qvftc7OdJWOsw3WiLjU-HzXzRUtgROZozqkcUoNPP0-hqveiMDGE6CGsaQIhHcp7JEascO6dtO6wgCJFyr2Ns"
            alt="Gym Background"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            ELITE STACKS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl"
          >
            Synergistic formulas engineered for maximum results.
          </motion.p>
        </div>
      </section>

      {/* Stacks Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stacks.map((stack, index) => (
            <motion.article
              key={stack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-black border border-zinc-800 flex flex-col group relative hover:border-primary transition-colors duration-500"
            >
              {stack.isBestSeller && (
                <div className="absolute top-6 left-6 z-10 bg-primary text-white px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest">
                  Best Seller
                </div>
              )}
              
              <div className="aspect-square w-full bg-zinc-900 overflow-hidden relative border-b border-zinc-800">
                <img
                  src={stack.image}
                  alt={stack.name}
                  className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-110"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {stack.name}
                </h2>
                <p className="text-2xl font-black text-primary mb-6">${stack.price}</p>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {stack.includedItems?.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-400 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-full transition-all duration-300 uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                  ADD TO CART
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
