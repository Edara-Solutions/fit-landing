import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { EmptyState, LoadingGrid } from '../components/AsyncState';
import ProductCard, { AddProductPayload } from '../components/ProductCard';
import { formatPrice, getId, getName } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCatalogStore } from '../stores/catalog.store';

const PRICE_MIN = 0;
const PRICE_MAX = 10000;
const PRICE_STEP = 50;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [priceRange, setPriceRange] = useState({
    min: Number(params.get('minPrice') || PRICE_MIN),
    max: Number(params.get('maxPrice') || PRICE_MAX),
  });
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

  useEffect(() => {
    setSearch(params.get('search') || '');
    setPriceRange({
      min: Number(params.get('minPrice') || PRICE_MIN),
      max: Number(params.get('maxPrice') || PRICE_MAX),
    });
  }, [params]);

  const updateParam = (key: string, value: string | number) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, String(value));
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };

  const updateParams = (values: Record<string, string | number>) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== '') next.set(key, String(value));
      else next.delete(key);
    });
    next.set('page', '1');
    setParams(next);
  };

  const clearFilters = () => {
    setSearch('');
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
    setParams(new URLSearchParams());
  };

  const handleMinPrice = (value: number) => {
    setPriceRange((current) => ({ ...current, min: Math.min(value, current.max) }));
  };

  const handleMaxPrice = (value: number) => {
    setPriceRange((current) => ({ ...current, max: Math.max(value, current.min) }));
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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Gear Up</h1>
              <p className="mt-3 max-w-xl text-sm text-zinc-500">Search, filter, and stack your next training cycle.</p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-primary hover:text-primary"
            >
              <X size={15} />
              Clear Filters
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateParam('search', search);
            }}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl shadow-black/20 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by product name"
                className="h-12 w-full rounded-full border border-zinc-800 bg-black py-3 pl-11 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-hover"
            >
              <Search size={16} />
              Search
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-5 flex items-center gap-3 border-b border-zinc-800 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-primary">
              <SlidersHorizontal size={17} />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Filters</h2>
              <p className="text-xs text-zinc-500">Refine by catalog, brand, type, sort, and price.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <FilterSelect label="Category" value={activeFilters.category} onChange={(value) => updateParam('category', value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={getId(category)} value={getId(category)}>{getName(category)}</option>)}
            </FilterSelect>

            <FilterSelect label="Brand" value={activeFilters.brand} onChange={(value) => updateParam('brand', value)}>
              <option value="">All brands</option>
              {brands.map((brand) => <option key={getId(brand)} value={getId(brand)}>{getName(brand)}</option>)}
            </FilterSelect>

            <FilterSelect label="Product Type" value={String(activeFilters.isStack)} onChange={(value) => updateParam('isStack', value)}>
              <option value="">All products</option>
              <option value="true">Stacks only</option>
              <option value="false">Singles only</option>
            </FilterSelect>

            <FilterSelect label="Sort" value={filters.sort || '-createdAt'} onChange={(value) => updateParam('sort', value)}>
              <option value="-createdAt">Latest</option>
              <option value="price">Price low to high</option>
              <option value="-price">Price high to low</option>
              <option value="name">Name</option>
            </FilterSelect>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Price Range</span>
                <p className="mt-1 text-sm font-bold text-white">{formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</p>
              </div>
              <button
                type="button"
                onClick={() => updateParams({
                  minPrice: priceRange.min === PRICE_MIN ? '' : priceRange.min,
                  maxPrice: priceRange.max === PRICE_MAX ? '' : priceRange.max,
                })}
                className="h-10 rounded-full border border-primary px-5 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Apply Price
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <RangeControl label="Minimum" value={priceRange.min} min={PRICE_MIN} max={priceRange.max} onChange={handleMinPrice} />
              <RangeControl label="Maximum" value={priceRange.max} min={priceRange.min} max={PRICE_MAX} onChange={handleMaxPrice} />
            </div>
          </div>
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

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-primary">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-full border border-zinc-800 bg-black px-4 text-sm font-bold text-white outline-none transition-all hover:border-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {children}
      </select>
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="text-xs font-black text-primary">{formatPrice(value)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={PRICE_STEP}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-primary"
      />
    </label>
  );
}
