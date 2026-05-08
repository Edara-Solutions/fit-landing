import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';

export default function Register() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await register(form);
      notify('Account created.', 'success');
      navigate('/account');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Registration failed.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-4xl font-black uppercase text-white mb-8">Register</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required placeholder="Full name" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required placeholder="Phone" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required placeholder="Email" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required placeholder="Password" className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white" />
        <button disabled={loading} className="w-full rounded-full bg-primary py-4 font-black uppercase text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">Already have an account? <Link to="/login" className="font-bold text-primary">Login</Link></p>
    </div>
  );
}
