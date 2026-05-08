import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { EmptyState, LoadingGrid } from '../components/AsyncState';
import ProductCard, { AddProductPayload } from '../components/ProductCard';
import { getId, getName } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCatalogStore } from '../stores/catalog.store';

export default function Home() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { products, categories, brands, loading, error, fetchProducts, fetchCategories, fetchBrands } = useCatalogStore();
  const featuredProducts = products.filter((product) => product.isFeatured === true);

  useEffect(() => {
    fetchProducts({ page: 1, limit: 4, sort: '-createdAt' });
    fetchCategories();
    fetchBrands();
  }, [fetchBrands, fetchCategories, fetchProducts]);

  const handleAdd = async ({ product, quantity, selectedFlavor }: AddProductPayload) => {
    if (!isAuthenticated) {
      notify('Please log in to add items to your cart.', 'error');
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (product.flavors?.length && !selectedFlavor) {
      notify('Please choose a flavor first.', 'error');
      return;
    }

    try {
      await addItem(getId(product), quantity, selectedFlavor);
      notify('Added to cart.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not add item to cart.', 'error');
    }
  };

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD64poyA9UDqbcmN9ADD2kDIiqQ-lKk3eHX3Q4H04qomO0irdkjQkopafo3KhkLKrib7syT12DL85p1oC_ZA2MJOXtzCskYCXBwHB4Uml9WJqVOFyspirR9etLBrCEhjxIJyx22bV4ELUITFuVc3GFAJ6GIvkD6o0sVcS1kGJD71MS0qnR5k8HkD6nNkaeo_EXEw0W1LOqkJJVSNcw0LHuzPaZ-gKYBPpOHAbkrbmSreyFvFWJ9hhF9q_TcilslSOL4BNOQZ0DzHA8"
            alt="Hero Athlete"
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight mb-6">
              Built to Perform
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 border-l-4 border-primary pl-6 mb-10 max-w-md">
              Unleash your ultimate potential with scientifically backed, high-octane supplements designed for the relentless.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/products')} className="cursor-pointer bg-primary text-white font-bold uppercase py-4 px-10 rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                Shop Now
              </button>
              <button onClick={() => navigate('/stacks')} className="cursor-pointer bg-transparent border-2 border-primary text-white font-bold uppercase py-4 px-10 rounded-full hover:bg-primary/10 transition-colors">
                View Stacks
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-white mb-4">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.slice(0, 8).map((category) => (
                <button key={getId(category)} onClick={() => navigate(`/products?category=${getId(category)}`)} className="border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-black uppercase text-zinc-200 hover:border-primary hover:text-primary">
                  {getName(category)}
                </button>
              ))}
              {!categories.length && <p className="text-zinc-500">No categories available yet.</p>}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase text-white mb-4">Brands</h2>
            <div className="flex flex-wrap gap-3">
              {brands.slice(0, 8).map((brand) => (
                <button key={getId(brand)} onClick={() => navigate(`/products?brand=${getId(brand)}`)} className="border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-black uppercase text-zinc-200 hover:border-primary hover:text-primary">
                  {getName(brand)}
                </button>
              ))}
              {!brands.length && <p className="text-zinc-500">No brands available yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Elite Arsenal</h2>
          <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-bold uppercase group">
            Shop All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {error ? <EmptyState title="Could not load products" body={error} /> : null}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? <LoadingGrid count={4} /> : featuredProducts.length ? featuredProducts.map((product, index) => <ProductCard key={getId(product)} product={product} index={index} onAdd={handleAdd} />) : <div className="md:col-span-4"><EmptyState title="No featured products yet" /></div>}
        </div>
      </section>
    </div>
  );
}
