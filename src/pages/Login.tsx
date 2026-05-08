import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useToast();
  const { login, loading, isAuthenticated } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const from = (location.state as { from?: string } | null)?.from || '/account';

  if (isAuthenticated) navigate(from, { replace: true });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      await fetchCart().catch(() => undefined);
      notify('Welcome back.', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Login failed.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-4xl font-black uppercase text-white mb-8">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required placeholder="Password" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <button disabled={loading} className="w-full rounded-full bg-primary py-4 font-black uppercase text-white disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">New here? <Link to="/register" className="font-bold text-primary">Create an account</Link></p>
    </div>
  );
}
