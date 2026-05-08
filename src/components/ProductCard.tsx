import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, isSoldOut, productId, productImage, productOriginalPrice, productPrice, productSlug } from '../lib/format';
import { Product } from '../types';

export interface AddProductPayload {
  product: Product;
  quantity: number;
  selectedFlavor?: string;
}

export default function ProductCard({
  product,
  index = 0,
  onAdd,
}: {
  key?: string;
  product: Product;
  index?: number;
  onAdd?: (payload: AddProductPayload) => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const soldOut = isSoldOut(product);
  const originalPrice = productOriginalPrice(product);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '');

  return (
    <motion.article
      key={productId(product)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/product/${productSlug(product)}`)}
      className="flex cursor-pointer flex-col bg-zinc-950 border border-zinc-800 group hover:border-primary transition-colors duration-300 rounded-lg overflow-hidden"
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
          {originalPrice ? <span className="text-sm font-bold text-zinc-600 line-through" style={{ fontSize: '12px' }}>{formatPrice(originalPrice)}</span> : null}
        </div>

        {onAdd && !soldOut ? (
          <div className="space-y-4" onClick={(event) => event.stopPropagation()}>
            {product.flavors?.length ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Flavor</span>
                </div>
                <div className="relative">
                  <select
                    value={selectedFlavor}
                    onChange={(event) => setSelectedFlavor(event.target.value)}
                    className="h-11 w-full appearance-none rounded-full border border-zinc-800 bg-black px-4 pr-10 text-xs font-black uppercase tracking-widest text-white outline-none transition-all hover:border-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {product.flavors.map((flavor) => (
                      <option
                        key={flavor}
                        value={flavor}
                        className="bg-zinc-950 text-white"
                      >
                        {flavor}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Qty</span>
              <div className="grid h-10 w-32 grid-cols-3 overflow-hidden rounded-full border border-zinc-800 bg-black">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex items-center justify-center text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-primary disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:bg-transparent"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="flex items-center justify-center border-x border-zinc-800 text-sm font-black text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex items-center justify-center text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <button
          disabled={soldOut}
          onClick={(event) => {
            event.stopPropagation();
            onAdd?.({ product, quantity, selectedFlavor: selectedFlavor || undefined });
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
