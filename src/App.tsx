/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactActions from './components/ContactActions';
import Home from './pages/Home';
import Products from './pages/Products';
import Stacks from './pages/Stacks';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Legal from './pages/Legal';
import Affiliate from './pages/Affiliate';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/auth.store';
import { useCartStore } from './stores/cart.store';

export default function App() {
  const { token, fetchMe, logout } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (!token) return;
    fetchMe()
      .then(() => fetchCart().catch(() => undefined))
      .catch(() => logout());
  }, [fetchCart, fetchMe, logout, token]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
              <Route path="/stacks" element={<PageWrapper><Stacks /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><ProtectedRoute><Cart /></ProtectedRoute></PageWrapper>} />
              <Route path="/orders" element={<PageWrapper><ProtectedRoute><Orders /></ProtectedRoute></PageWrapper>} />
              <Route path="/order/:id" element={<PageWrapper><ProtectedRoute><OrderDetails /></ProtectedRoute></PageWrapper>} />
              <Route path="/product/:slug" element={<PageWrapper><ProductDetail /></PageWrapper>} />
              <Route path="/checkout" element={<PageWrapper><ProtectedRoute><Checkout /></ProtectedRoute></PageWrapper>} />
              <Route path="/payment/:orderId" element={<PageWrapper><ProtectedRoute><Payment /></ProtectedRoute></PageWrapper>} />
              <Route path="/account" element={<PageWrapper><ProtectedRoute><Account /></ProtectedRoute></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/shipping" element={<PageWrapper><Shipping /></PageWrapper>} />
              <Route path="/legal" element={<PageWrapper><Legal /></PageWrapper>} />
              <Route path="/affiliate" element={<PageWrapper><Affiliate /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
        <ContactActions variant="floating" />
        <Footer />
      </div>
    </Router>
  );
}

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
