import { motion } from 'motion/react';
import { useEffect } from 'react';
import { EmptyState, LoadingGrid } from '../components/AsyncState';
import ProductCard from '../components/ProductCard';
import { getId } from '../lib/format';
import { useCatalogStore } from '../stores/catalog.store';

export default function Stacks() {
  const { products, loading, error, fetchProducts } = useCatalogStore();

  useEffect(() => {
    fetchProducts({ isStack: true, page: 1, limit: 12 });
  }, [fetchProducts]);

  return (
    <div className="flex flex-col">
      <section className="relative pt-32 pb-24 border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_w8SGhu1zUhcuhiKDBDW0_ywTxO2VzKJ1RZWRLM9dFSOuBiH6406eoc2qItpVkB0Xdqtbp2huouKveGgRFPROCbr6gKQQSCRXL3H305ClXYHy8UvSm5Gq1Pw9mzE12fOPgijvHH6fP1tv4ec9DpSeyEzF6N3zjIK3dMJKUQfp8MeOJ9baqxbCm3qvftc7OdJWOsw3WiLjU-HzXzRUtgROZozqkcUoNPP0-hqveiMDGE6CGsaQIhHcp7JEascO6dtO6wgCJFyr2Ns" alt="Gym Background" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
            ELITE STACKS
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-zinc-400 max-w-2xl">
            Synergistic formulas engineered for maximum results.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        {error ? <EmptyState title="Could not load stacks" body={error} /> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? <LoadingGrid /> : products.length ? products.map((stack, index) => <ProductCard key={getId(stack)} product={stack} index={index} />) : <div className="lg:col-span-4"><EmptyState title="No stacks available" /></div>}
        </div>
      </section>
    </div>
  );
}
