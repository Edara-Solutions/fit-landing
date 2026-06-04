import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cartItems, getId, getName } from '../lib/format';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCatalogStore } from '../stores/catalog.store';
import logo from '../assets/images/logo.png';

const LINKS = [
  { name: 'Products', href: '/products' },
  { name: 'Stacks', href: '/stacks' },
  { name: 'Orders', href: '/orders' },
  // { name: 'About', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<'categories' | 'brands' | null>(null);
  const location = useLocation();
  const { isAuthenticated, customer, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const categories = useCatalogStore((state) => state.categories);
  const brands = useCatalogStore((state) => state.brands);
  const fetchCategories = useCatalogStore((state) => state.fetchCategories);
  const fetchBrands = useCatalogStore((state) => state.fetchBrands);
  const cartCount = cartItems(cart).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const navLinks = LINKS.filter((link) => link.name !== 'Orders' || isAuthenticated);

  useEffect(() => {
    if (!categories.length) fetchCategories();
    if (!brands.length) fetchBrands();
  }, [brands.length, categories.length, fetchBrands, fetchCategories]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 text-3xl md:text-4xl font-black text-white italic tracking-tighter flex items-center">
          <img src={logo} alt="FIT" className="h-14 sm:h-16 lg:h-22" />
        </Link>

        <div className="hidden lg:flex min-w-0 flex-1 items-center justify-center gap-3 xl:gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-bold uppercase tracking-tighter transition-all hover:text-primary hover:scale-105 ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <CatalogDropdown label="Categories" items={categories} queryKey="category" pathname={location.pathname} search={location.search} />
          <CatalogDropdown label="Brands" items={brands} queryKey="brand" pathname={location.pathname} search={location.search} align="right" />
        </div>

        <div className="hidden lg:flex shrink-0 items-center gap-4 xl:gap-6">
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            title={customer?.fullName || 'Account'}
            className="text-white hover:text-primary transition-all hover:scale-110"
          >
            <User className="w-6 h-6" />
          </Link>
          {isAuthenticated && (
            <button
              onClick={logout}
              title="Log out"
              className="cursor-pointer text-white hover:text-primary transition-all hover:scale-110"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <Link to="/cart" className="relative text-white hover:text-primary transition-all hover:scale-110">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 min-w-5 h-5 rounded-full bg-primary px-1 text-center text-[10px] font-black leading-5 text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            aria-label="Cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-white transition-colors hover:border-primary hover:text-primary"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-primary px-1 text-center text-[10px] font-black leading-5 text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-white transition-colors hover:border-primary hover:text-primary cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-950 border-b border-zinc-900 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <MobileCatalogDropdown
                label="Categories"
                items={categories}
                queryKey="category"
                isOpen={openMobileDropdown === 'categories'}
                onToggle={() => setOpenMobileDropdown((current) => current === 'categories' ? null : 'categories')}
                onNavigate={closeMobileMenu}
              />
              <MobileCatalogDropdown
                label="Brands"
                items={brands}
                queryKey="brand"
                isOpen={openMobileDropdown === 'brands'}
                onToggle={() => setOpenMobileDropdown((current) => current === 'brands' ? null : 'brands')}
                onNavigate={closeMobileMenu}
              />
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                {isAuthenticated ? 'Profile' : 'Login'}
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="cursor-pointer flex items-center gap-3 text-left text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

type CatalogItem = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
};

function CatalogDropdown({
  label,
  items,
  queryKey,
  pathname,
  search,
  align = 'left',
}: {
  label: string;
  items: CatalogItem[];
  queryKey: 'category' | 'brand';
  pathname: string;
  search: string;
  align?: 'left' | 'right';
}) {
  const isActive = pathname === '/products' && new URLSearchParams(search).has(queryKey);

  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-1 text-sm font-bold uppercase tracking-tighter transition-all hover:text-primary ${
          isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-white'
        }`}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>

      <div
        className={`invisible absolute top-full z-50 mt-4 w-[min(84vw,28rem)] rounded-lg border border-zinc-800 bg-zinc-950 p-3 opacity-0 shadow-2xl shadow-black/50 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
      >
        <Link
          to="/products"
          className="mb-2 flex rounded-md px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-400 transition-colors hover:bg-black hover:text-primary"
        >
          All {label}
        </Link>
        <div className="max-h-[22rem] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {items.map((item) => {
              const id = getId(item);
              const name = getName(item);
              if (!id || !name) return null;

              return (
                <Link
                  key={id}
                  to={`/products?${queryKey}=${encodeURIComponent(id)}`}
                  className="rounded-md px-3 py-2 text-sm font-bold uppercase tracking-tight text-zinc-200 transition-colors hover:bg-black hover:text-primary"
                >
                  {name}
                </Link>
              );
            })}
          </div>
          {!items.length && <p className="px-3 py-2 text-sm text-zinc-500">No {label.toLowerCase()} available yet.</p>}
        </div>
      </div>
    </div>
  );
}

function MobileCatalogDropdown({
  label,
  items,
  queryKey,
  isOpen,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: CatalogItem[];
  queryKey: 'category' | 'brand';
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-zinc-900 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-zinc-800 bg-black p-2">
              <Link
                to="/products"
                onClick={onNavigate}
                className="block rounded-md px-3 py-3 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-primary"
              >
                All {label}
              </Link>
              {items.map((item) => {
                const id = getId(item);
                const name = getName(item);
                if (!id || !name) return null;

                return (
                  <Link
                    key={id}
                    to={`/products?${queryKey}=${encodeURIComponent(id)}`}
                    onClick={onNavigate}
                    className="block rounded-md px-3 py-3 text-sm font-bold uppercase tracking-tight text-zinc-200 hover:bg-zinc-950 hover:text-primary"
                  >
                    {name}
                  </Link>
                );
              })}
              {!items.length && <p className="px-3 py-3 text-sm text-zinc-500">No {label.toLowerCase()} available yet.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
