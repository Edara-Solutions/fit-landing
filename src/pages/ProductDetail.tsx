import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, ShoppingCart, Truck, ChevronDown, Plus, Minus, ArrowRight, PlusCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { motion } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0] || '');
  const [selectedServing, setSelectedServing] = useState(product?.servings?.[0] || 0);

  if (!product) return <div className="text-center py-24">Product not found</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
        {/* Left: Product Image Gallery */}
        <div className="flex flex-col gap-6 sticky top-32">
          <div className="w-full aspect-square bg-zinc-900 rounded-sm flex items-center justify-center overflow-hidden border border-zinc-800">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-8"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-24 flex-shrink-0 bg-zinc-900 border border-zinc-800 hover:border-primary cursor-pointer transition-all opacity-70 hover:opacity-100 overflow-hidden">
                <img src={product.image} className="w-full h-full object-contain p-2" alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              {product.isBestSeller && (
                <span className="bg-primary text-white font-black text-[10px] px-3 py-1 rounded-sm uppercase tracking-widest">
                  Best Seller
                </span>
              )}
              <div className="flex items-center text-primary">
                {[1, 2, 3, 4].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                <Star size={16} className="text-zinc-700" />
                <span className="ml-3 text-zinc-400 text-sm font-medium">(428 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-primary">${product.price}</p>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-lg">
              {product.description}
            </p>
          </div>

          {/* Selections */}
          {product.flavors && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Select Flavor</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`py-3 px-4 text-xs font-bold uppercase rounded-sm border-2 transition-all truncate ${
                      selectedFlavor === flavor
                        ? 'bg-zinc-900 border-primary text-white'
                        : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.servings && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Servings</h3>
              <div className="flex gap-4">
                {product.servings.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedServing(s)}
                    className={`py-2 px-8 font-bold uppercase rounded-sm border-2 transition-all ${
                      selectedServing === s
                        ? 'bg-zinc-900 border-primary text-white'
                        : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {s} SVGS
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="bg-zinc-900/50 p-8 rounded-sm border border-zinc-800 mt-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center bg-black border border-zinc-800 rounded-full h-14 w-32 px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 text-white hover:text-primary transition-colors flex justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 text-white hover:text-primary transition-colors flex justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                disabled={product.isSoldOut}
                onClick={() => navigate('/checkout')}
                className="flex-1 min-w-[200px] bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest h-14 rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:grayscale disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-emerald-500 text-sm font-medium">
              <Truck size={16} />
              Free shipping on orders over $75
            </div>
          </div>

          {/* Details Accordion */}
          <div className="border-t border-zinc-800 mt-12">
            <details className="group border-b border-zinc-800" open>
              <summary className="flex justify-between items-center font-black uppercase py-6 cursor-pointer list-none hover:text-primary transition-colors">
                Nutritional Facts
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-8">
                <div className="bg-zinc-900 p-8 border border-zinc-800">
                  <h4 className="text-2xl font-black text-white border-b-4 border-black pb-4 mb-6">Supplement Facts</h4>
                  <div className="text-sm font-bold text-zinc-400 mb-6 font-mono">
                    Serving Size: 1 Scoop (15g)<br />
                    Servings Per Container: 30
                  </div>
                  <div className="space-y-4">
                    {product.ingredients?.map((ing) => (
                      <div key={ing.name} className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="font-bold text-zinc-100 uppercase text-sm tracking-tight">{ing.name}</span>
                        <span className="font-mono text-zinc-300">{ing.amount}</span>
                      </div>
                    )) || (
                      <div className="text-zinc-500 italic">Nutritional information coming soon...</div>
                    )}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Suggested Stacks */}
      <section className="mt-40 border-t border-zinc-800 pt-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Stack & Destroy</h2>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-primary hover:text-white font-bold uppercase transition-colors group">
            View All Stacks <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {PRODUCTS.filter(p => p.id !== id).slice(0, 3).map((p) => (
             <div onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0,0); }} key={p.id} className="bg-zinc-950 group cursor-pointer border border-zinc-800 hover:border-primary transition-all duration-500 overflow-hidden">
                <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative">
                   <img src={p.image} alt={p.name} className="w-full h-full object-contain p-8 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-110" />
                   {p.isBestSeller && <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest">Essential</div>}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black uppercase text-white mb-2">{p.name}</h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{p.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white">${p.price}</span>
                    <PlusCircle className="text-zinc-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
             </div>
           ))}
        </div>
      </section>
    </main>
  );
}
