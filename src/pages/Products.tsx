import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const CATEGORIES = ['All Products', 'Pre-Workout', 'Protein', 'Recovery', 'Stacks'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const navigate = useNavigate();

  const filteredProducts = PRODUCTS.filter(p => 
    activeCategory === 'All Products' || p.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
          Gear Up
        </h1>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold uppercase transition-all border-2 ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-primary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex flex-col bg-zinc-950 border border-zinc-800 group hover:border-primary transition-colors duration-300 cursor-pointer"
          >
            <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
              {product.isSale && (
                <span className="absolute top-4 left-4 bg-primary text-white font-black uppercase text-[10px] px-3 py-1 z-10 tracking-widest rounded-sm">
                  Sale
                </span>
              )}
              {product.isSoldOut && (
                <span className="absolute top-4 left-4 bg-zinc-800 text-zinc-400 font-black uppercase text-[10px] px-3 py-1 z-10 tracking-widest rounded-sm">
                  Sold Out
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ${product.isSoldOut ? 'grayscale' : ''}`}
              />
            </div>

            <div className="p-8 flex flex-col gap-4 flex-grow">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 mt-auto">
                {product.originalPrice ? (
                  <>
                    <span className="text-xl font-black text-primary">${product.price}</span>
                    <span className="text-sm font-bold text-zinc-600 line-through">${product.originalPrice}</span>
                  </>
                ) : (
                  <span className="text-xl font-black text-white">${product.price}</span>
                )}
              </div>
              <button 
                disabled={product.isSoldOut}
                className={`w-full font-bold uppercase py-3 px-6 rounded-full transition-all ${
                  product.isSoldOut 
                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/10'
                }`}
              >
                {product.isSoldOut ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
