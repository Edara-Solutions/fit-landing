import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../constants';

export default function Home() {
  const navigate = useNavigate();
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight mb-6">
              Built to Perform
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 border-l-4 border-primary pl-6 mb-10 max-w-md">
              Unleash your ultimate potential with scientifically backed, high-octane supplements designed for the relentless.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/products')}
                className="bg-primary text-white font-bold uppercase py-4 px-10 rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
              >
                Shop Now
              </button>
              <button className="bg-transparent border-2 border-primary text-white font-bold uppercase py-4 px-10 rounded-full hover:bg-primary/10 transition-colors">
                View Stacks
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Skew */}
        <div className="absolute right-0 bottom-0 w-1/3 h-1/2 bg-primary/20 skew-x-12 translate-x-1/4 translate-y-1/4 -z-0" />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            Elite Arsenal
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-bold uppercase group"
          >
            Shop All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group relative bg-black border border-zinc-800 p-8 flex flex-col justify-between aspect-square hover:border-primary transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {product.isBestSeller && (
                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-sm z-20 uppercase tracking-widest">
                  Best Seller
                </div>
              )}
              {product.isSoldOut && (
                <div className="absolute top-6 left-6 bg-zinc-800 text-zinc-400 text-[10px] font-black px-3 py-1 rounded-sm z-20 uppercase tracking-widest">
                  Sold Out
                </div>
              )}

              <div className="relative h-2/3 flex items-center justify-center mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ${product.isSoldOut ? 'grayscale opacity-50' : ''}`}
                />
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  {product.name}
                </h3>
                <p className="text-zinc-400 font-bold">${product.price}</p>
                
                {!product.isSoldOut && (
                  <button className="mt-6 w-full bg-zinc-900 text-white font-bold py-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-primary translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Add to Cart
                  </button>
                )}
                {product.isSoldOut && (
                  <button className="mt-6 w-full bg-zinc-950 text-zinc-600 font-bold py-3 rounded-full cursor-not-allowed uppercase text-sm">
                    Out of Stock
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
