import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatPrice, isSoldOut, productId, productImage, productOriginalPrice, productPrice, productSlug } from '../lib/format';
import { Product } from '../types';

export default function ProductCard({
  product,
  index = 0,
  onAdd,
}: {
  key?: string;
  product: Product;
  index?: number;
  onAdd?: (product: Product) => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const soldOut = isSoldOut(product);
  const originalPrice = productOriginalPrice(product);

  return (
    <motion.article
      key={productId(product)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/product/${productSlug(product)}`)}
      className="flex cursor-pointer flex-col bg-zinc-950 border border-zinc-800 group hover:border-primary transition-colors duration-300"
    >
      <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
        {(product.discountPrice || product.isSale) && (
          <span className="absolute top-4 left-4 bg-primary text-white font-black uppercase text-[10px] px-3 py-1 z-10 tracking-widest rounded-sm">
            Sale
          </span>
        )}
        {soldOut && (
          <span className="absolute top-4 left-4 bg-zinc-800 text-zinc-400 font-black uppercase text-[10px] px-3 py-1 z-10 tracking-widest rounded-sm">
            Sold Out
          </span>
        )}
        <img
          src={productImage(product)}
          alt={product.name || 'Product'}
          onError={(event) => { event.currentTarget.src = productImage(null); }}
          className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ${soldOut ? 'grayscale' : ''}`}
        />
      </div>

      <div className="p-8 flex flex-col gap-4 flex-grow">
        <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-2">
          {product.name || 'Unnamed product'}
        </h3>
        <div className="flex items-center gap-3 mt-auto">
          <span className="text-xl font-black text-primary">{formatPrice(productPrice(product))}</span>
          {originalPrice ? <span className="text-sm font-bold text-zinc-600 line-through">{formatPrice(originalPrice)}</span> : null}
        </div>
        <button
          disabled={soldOut}
          onClick={(event) => {
            event.stopPropagation();
            onAdd?.(product);
          }}
          className={`w-full font-bold uppercase py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 ${
            soldOut
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/10'
          }`}
        >
          <ShoppingCart size={16} />
          {soldOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.article>
  );
}
