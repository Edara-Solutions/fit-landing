import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cartItems } from '../lib/format';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import logo from '../assets/images/logo.png';

const LINKS = [
  { name: 'Products', href: '/products' },
  { name: 'Stacks', href: '/stacks' },
  { name: 'Orders', href: '/orders' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, customer, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cartItems(cart).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const navLinks = LINKS.filter((link) => link.name !== 'Orders' || isAuthenticated);

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="text-3xl md:text-4xl font-black text-white italic tracking-tighter flex items-center">
          <img src={logo} alt="FIT" className="h-16 md:h-22" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
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
        </div>

        <div className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
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
            className="md:hidden bg-zinc-950 border-b border-zinc-900 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                {isAuthenticated ? 'Profile' : 'Login'}
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
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
