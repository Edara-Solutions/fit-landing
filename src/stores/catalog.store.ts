import { create } from 'zustand';
import { normalizeApiError } from '../lib/apiClient';
import { brandsService } from '../services/brands.service';
import { categoriesService } from '../services/categories.service';
import { ProductFilters, productsService } from '../services/products.service';
import { reviewsService } from '../services/reviews.service';
import { Brand, Category, Pagination, Product, Review } from '../types';

interface CatalogState {
  products: Product[];
  productDetails: Record<string, Product>;
  categories: Category[];
  brands: Brand[];
  reviews: Review[];
  filters: ProductFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  setFilters: (filters: Partial<ProductFilters>) => void;
  fetchProducts: (filters?: Partial<ProductFilters>) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchProductReviews: (productId: string) => Promise<void>;
}

const defaultPagination = { page: 1, limit: 12, total: 0, pages: 0 };

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  productDetails: {},
  categories: [],
  brands: [],
  reviews: [],
  filters: { page: 1, limit: 12, sort: '-createdAt' },
  pagination: defaultPagination,
  loading: false,
  error: null,
  setFilters(filters) {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
  async fetchProducts(filters = {}) {
    const merged = { ...get().filters, ...filters };
    set({ loading: true, error: null, filters: merged });
    try {
      const { products, pagination } = await productsService.list(merged);
      set({ products, pagination: pagination || defaultPagination, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
    }
  },
  async fetchProductBySlug(slug) {
    set({ loading: true, error: null });
    try {
      const { product } = await productsService.bySlug(slug);
      set((state) => ({ productDetails: { ...state.productDetails, [slug]: product }, loading: false }));
      return product;
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      return null;
    }
  },
  async fetchCategories() {
    try {
      const { categories } = await categoriesService.list();
      set({ categories });
    } catch (error) {
      set({ error: normalizeApiError(error).message });
    }
  },
  async fetchBrands() {
    try {
      const { brands } = await brandsService.list();
      set({ brands });
    } catch (error) {
      set({ error: normalizeApiError(error).message });
    }
  },
  async fetchProductReviews(productId) {
    try {
      const { reviews } = await reviewsService.list(productId);
      set({ reviews });
    } catch (error) {
      set({ error: normalizeApiError(error).message });
    }
  },
}));
