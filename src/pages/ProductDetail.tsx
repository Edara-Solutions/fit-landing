import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Truck, ChevronDown, Plus, Minus, ArrowRight, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { EmptyState } from '../components/AsyncState';
import GlobalLoader from '../components/GlobalLoader';
import { formatPrice, getName, isSoldOut, productId, productImage, productOriginalPrice, productPrice, productSlug, productTextList } from '../lib/format';
import { useToast } from '../lib/toast';
import { reviewsService } from '../services/reviews.service';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCatalogStore } from '../stores/catalog.store';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { isAuthenticated } = useAuthStore();
  const { addItem, loading: cartLoading } = useCartStore();
  const { productDetails, products, reviews, loading, error, fetchProductBySlug, fetchProductReviews, fetchProducts } = useCatalogStore();
  const product = productDetails[slug];
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchProductBySlug(slug).then((loaded) => {
      if (loaded) {
        setSelectedFlavor(loaded.flavors?.[0] || '');
        setSelectedImage(loaded.images?.[0] || productImage(loaded));
        const id = productId(loaded);
        if (id) fetchProductReviews(id);
      }
    });
    fetchProducts({ page: 1, limit: 4 });
  }, [fetchProductBySlug, fetchProductReviews, fetchProducts, slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      notify('Please log in before adding items to your cart.', 'error');
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }
    if (product.flavors?.length && !selectedFlavor) {
      notify('Please choose a flavor first.', 'error');
      return;
    }
    await addItem(productId(product), quantity, selectedFlavor || undefined);
    notify('Added to cart.', 'success');
  };

  const submitReview = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      notify('Please log in to review this product.', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewsService.create(productId(product), { rating: reviewRating, comment: reviewComment || undefined });
      await fetchProductReviews(productId(product));
      setReviewComment('');
      notify('Review submitted.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading && !product) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><GlobalLoader label="Loading product" /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><EmptyState title="Product not found" body={error || 'This product is not available.'} /></div>;

  const images = product.images?.length ? product.images : [productImage(product)];
  const mainImage = selectedImage || images[0];
  const soldOut = isSoldOut(product);
  const currentPrice = productPrice(product);
  const originalPrice = productOriginalPrice(product);
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const nutritionFacts = product.nutritionFacts ? Object.entries(product.nutritionFacts).filter(([, value]) => value !== null && value !== undefined && value !== '') : [];
  const usageInstructions = productTextList(product.usageInstructions);
  const warnings = productTextList(product.warnings);

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
        <div className="flex flex-col gap-6 lg:sticky lg:top-32">
          <div className="w-full aspect-square bg-zinc-900 rounded-sm flex items-center justify-center overflow-hidden border border-zinc-800">
            <motion.img key={mainImage} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={mainImage} onError={(event) => { event.currentTarget.src = productImage(null); }} alt={product.name || 'Product'} className="w-full h-full object-contain p-8" />
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`w-24 h-24 flex-shrink-0 bg-zinc-900 border overflow-hidden transition-all hover:border-primary ${mainImage === image ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-800'}`}
              >
                <img src={image} onError={(event) => { event.currentTarget.src = productImage(null); }} className="w-full h-full object-contain p-2" alt="Thumbnail" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              {product.isBestSeller || product.isFeatured ? <span className="bg-primary text-white font-black text-[10px] px-3 py-1 rounded-sm uppercase tracking-widest">Featured</span> : null}
              <div className="flex items-center text-primary">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill={i <= Math.round(product.averageRating || 0) ? 'currentColor' : 'none'} />)}
                <span className="ml-3 text-zinc-400 text-sm font-medium">({reviews.length || product.reviewCount || 0} Reviews)</span>
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">{getName(product.brand)} {getName(product.category) ? `/ ${getName(product.category)}` : ''}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{product.name}</h1>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="text-4xl font-black text-primary">{formatPrice(currentPrice)}</span>
              {originalPrice && originalPrice > currentPrice ? (
                <>
                  <span className="text-lg font-bold text-zinc-500 line-through">{formatPrice(originalPrice)}</span>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    Save {discountPercent}%
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-lg">{product.description || product.shortDescription || 'Product details coming soon.'}</p>
            {typeof product.stock === 'number' ? <p className="text-sm font-bold uppercase text-zinc-500">Stock: {product.stock}</p> : null}
          </div>

          {product.flavors?.length ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Select Flavor</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.flavors.map((flavor) => (
                  <button key={flavor} onClick={() => setSelectedFlavor(flavor)} className={`cursor-pointer rounded-lg py-3 px-4 text-xs font-bold uppercase rounded-sm border-2 transition-all truncate ${selectedFlavor === flavor ? 'bg-zinc-900 border-primary text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="bg-zinc-900/50 p-8 rounded-sm border border-zinc-800 mt-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center bg-black border border-zinc-800 rounded-full h-14 w-32 px-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="cursor-pointer flex-1 text-white hover:text-primary transition-colors flex justify-center"><Minus size={16} /></button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="cursor-pointer flex-1 text-white hover:text-primary transition-colors flex justify-center"><Plus size={16} /></button>
              </div>
              <button disabled={soldOut || cartLoading} onClick={handleAddToCart} className="cursor-pointer flex-1 min-w-[200px] bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest h-14 rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:grayscale disabled:cursor-not-allowed">
                <ShoppingCart size={20} />
                {soldOut ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-emerald-500 text-sm font-medium"><Truck size={16} />Free shipping may apply at checkout</div>
          </div>

          <div className="border-t border-zinc-800 mt-12">
            <details className="group border-b border-zinc-800" open>
              <summary className="flex justify-between items-center font-black uppercase py-6 cursor-pointer list-none hover:text-primary transition-colors">Nutritional Facts<ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" /></summary>
              <div className="pb-8">
                <div className="bg-zinc-900 p-8 border border-zinc-800">
                  {nutritionFacts.length ? nutritionFacts.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-6 border-b border-zinc-800 pb-2 mb-3">
                      <span className="font-bold text-zinc-100 uppercase text-sm tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-zinc-300 text-right">{String(value)}</span>
                    </div>
                  )) : <div className="text-zinc-500 italic">Nutritional information coming soon.</div>}
                </div>
              </div>
            </details>

            {usageInstructions.length ? (
              <details className="group border-b border-zinc-800">
                <summary className="flex justify-between items-center font-black uppercase py-6 cursor-pointer list-none hover:text-primary transition-colors">Usage Instructions<ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" /></summary>
                <div className="pb-8">
                  <div className="border border-emerald-900/60 bg-emerald-950/20 p-6">
                    <ol className="space-y-4">
                      {usageInstructions.map((instruction, index) => (
                        <li key={`${instruction}-${index}`} className="flex gap-4">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-black text-emerald-300">{index + 1}</span>
                          <span className="text-sm leading-relaxed text-zinc-200">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>
            ) : null}

            {warnings.length ? (
              <details className="group border-b border-zinc-800">
                <summary className="flex justify-between items-center font-black uppercase py-6 cursor-pointer list-none hover:text-primary transition-colors">Warnings<ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" /></summary>
                <div className="pb-8">
                  <div className="border border-primary/50 bg-primary/10 p-6">
                    <ul className="space-y-4">
                      {warnings.map((warning, index) => (
                        <li key={`${warning}-${index}`} className="flex gap-4">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span className="text-sm leading-relaxed text-red-100">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 pt-16">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {reviews.length ? reviews.map((review) => (
              <div key={review._id || review.id} className="border border-zinc-800 bg-zinc-950 p-6">
                <div className="mb-2 flex text-primary">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill={i <= Number(review.rating || 0) ? 'currentColor' : 'none'} />)}</div>
                <p className="text-zinc-300">{review.comment || 'No comment provided.'}</p>
              </div>
            )) : <EmptyState title="No reviews yet" />}
          </div>
          <div className="border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-black uppercase text-white mb-4">Write a Review</h3>
            <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="mb-3 w-full border border-zinc-800 bg-zinc-900 p-3 text-white">
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </select>
            <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Your review" className="min-h-28 w-full border border-zinc-800 bg-zinc-900 p-3 text-white" />
            <button disabled={submittingReview} onClick={submitReview} className="mt-3 w-full rounded-full bg-primary py-3 font-black uppercase text-white disabled:opacity-60">Submit</button>
          </div>
        </div>
      </section>

      <section className="mt-32 border-t border-zinc-800 pt-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">More Fuel</h2>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-primary hover:text-white font-bold uppercase transition-colors group">View All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.filter((item) => productSlug(item) !== slug).slice(0, 3).map((item, index) => <ProductCard key={productId(item)} product={item} index={index} />)}
          {!products.length && <div className="md:col-span-3"><EmptyState title="No related products" /></div>}
        </div>
      </section>
    </main>
  );
}
