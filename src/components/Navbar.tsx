import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LINKS = [
  { name: 'Products', href: '/products' },
  { name: 'Stacks', href: '/stacks' },
  { name: 'Orders', href: '/orders' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white p-2 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link to="/" className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">
            FOX
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => {
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

        <div className="flex items-center gap-4 md:gap-6">
          <Link to="#" className="text-white hover:text-primary transition-all hover:scale-110">
            <User className="w-6 h-6" />
          </Link>
          <Link to="/checkout" className="text-white hover:text-primary transition-all hover:scale-110">
            <ShoppingCart className="w-6 h-6" />
          </Link>
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
              {LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
