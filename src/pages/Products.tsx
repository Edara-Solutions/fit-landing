import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { EmptyState, LoadingGrid } from '../components/AsyncState';
import ProductCard, { AddProductPayload } from '../components/ProductCard';
import { getId, getName } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCatalogStore } from '../stores/catalog.store';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const { products, categories, brands, filters, pagination, loading, error, fetchProducts, fetchCategories, fetchBrands } = useCatalogStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { notify } = useToast();

  const activeFilters = useMemo(() => ({
    category: params.get('category') || '',
    brand: params.get('brand') || '',
    search: params.get('search') || '',
    page: Number(params.get('page') || 1),
    limit: 12,
    sort: params.get('sort') || '-createdAt',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    isStack: params.get('isStack') || '',
  }), [params]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    fetchProducts(activeFilters);
  }, [activeFilters, fetchProducts]);

  const updateParam = (key: string, value: string | number) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, String(value));
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };

  const handleAdd = async ({ product, quantity, selectedFlavor }: AddProductPayload) => {
    if (!isAuthenticated) {
      notify('Please log in to add items to your cart.', 'error');
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
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
      <header className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Gear Up</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateParam('search', search);
            }}
            className="relative w-full md:w-96"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-full border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-white outline-none focus:border-primary" />
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <select value={activeFilters.category} onChange={(event) => updateParam('category', event.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 text-white">
            <option value="">All categories</option>
            {categories.map((category) => <option key={getId(category)} value={getId(category)}>{getName(category)}</option>)}
          </select>
          <select value={activeFilters.brand} onChange={(event) => updateParam('brand', event.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 text-white">
            <option value="">All brands</option>
            {brands.map((brand) => <option key={getId(brand)} value={getId(brand)}>{getName(brand)}</option>)}
          </select>
          <select value={String(activeFilters.isStack)} onChange={(event) => updateParam('isStack', event.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 text-white">
            <option value="">All products</option>
            <option value="true">Stacks only</option>
            <option value="false">Singles only</option>
          </select>
          <select value={filters.sort || '-createdAt'} onChange={(event) => updateParam('sort', event.target.value)} className="bg-zinc-950 border border-zinc-800 p-3 text-white">
            <option value="-createdAt">Latest</option>
            <option value="price">Price low to high</option>
            <option value="-price">Price high to low</option>
            <option value="name">Name</option>
          </select>
          <input value={activeFilters.minPrice} onChange={(event) => updateParam('minPrice', event.target.value)} placeholder="Min price" type="number" className="bg-zinc-950 border border-zinc-800 p-3 text-white" />
          <input value={activeFilters.maxPrice} onChange={(event) => updateParam('maxPrice', event.target.value)} placeholder="Max price" type="number" className="bg-zinc-950 border border-zinc-800 p-3 text-white" />
        </div>
      </header>

      {error ? <EmptyState title="Could not load products" body={error} /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? <LoadingGrid /> : products.length ? products.map((product, index) => <ProductCard key={getId(product)} product={product} index={index} onAdd={handleAdd} />) : <div className="lg:col-span-4"><EmptyState title="No products found" body="Try clearing filters or searching for something else." /></div>}
      </div>

      {pagination.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <button disabled={pagination.page <= 1} onClick={() => updateParam('page', pagination.page - 1)} className="rounded-full border border-zinc-800 px-5 py-2 font-bold uppercase text-white disabled:opacity-40">Prev</button>
          <span className="text-sm text-zinc-400">Page {pagination.page} of {pagination.pages}</span>
          <button disabled={pagination.page >= pagination.pages} onClick={() => updateParam('page', pagination.page + 1)} className="rounded-full border border-zinc-800 px-5 py-2 font-bold uppercase text-white disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
