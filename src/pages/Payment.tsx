import { FormEvent, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { EmptyState } from '../components/AsyncState';
import { formatPrice } from '../lib/format';
import { useToast } from '../lib/toast';
import { useCheckoutStore } from '../stores/checkout.store';

export default function Payment() {
  const { orderId = '' } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { paymentInstructions, loading, error, fetchPaymentInstructions, submitPaymentProof } = useCheckoutStore();
  const [form, setForm] = useState<Record<string, string>>({ transactionReference: '', senderPhone: '', senderName: '', paidAmount: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPaymentInstructions(orderId);
  }, [fetchPaymentInstructions, orderId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData();
    if (file) data.append('proofImage', file);
    (Object.entries(form) as [string, string][]).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    try {
      await submitPaymentProof(orderId, data);
      notify('Payment proof submitted.', 'success');
      navigate(`/order/${orderId}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not submit proof.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <Link to={`/order/${orderId}`} className="text-sm font-black uppercase text-primary">Back to order</Link>
      <h1 className="mt-6 text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">Payment Instructions</h1>
      {error ? <div className="mt-8"><EmptyState title="Could not load instructions" body={error} /></div> : null}
      <section className="mt-8 border border-zinc-800 bg-zinc-950 p-8">
        {loading && !paymentInstructions ? <p className="text-zinc-400">Loading instructions...</p> : (
          <div className="space-y-3">
            {paymentInstructions ? Object.entries(paymentInstructions).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-6 border-b border-zinc-800 pb-3 text-sm">
                <span className="font-black uppercase text-zinc-500">{key}</span>
                <span className="text-right text-white">{typeof value === 'number' ? formatPrice(value) : String(value)}</span>
              </div>
            )) : <p className="text-zinc-400">Instructions will appear here when the backend provides them.</p>}
          </div>
        )}
      </section>

      <form onSubmit={submit} className="mt-8 border border-zinc-800 bg-zinc-950 p-8 space-y-4">
        <h2 className="text-2xl font-black uppercase text-white">Submit Proof</h2>
        <label className="group flex min-h-40 cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-800 bg-zinc-900/60 p-6 text-center transition-all hover:border-primary hover:bg-primary/5">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="sr-only"
          />
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-black text-zinc-300 transition-colors group-hover:border-primary group-hover:text-primary">
            <Upload size={22} />
          </span>
          <span className="text-sm font-black uppercase tracking-widest text-white">
            {file ? file.name : 'Upload payment proof (mandatory)'}
          </span>
          <span className="max-w-sm text-xs font-medium text-zinc-500">
            JPG, PNG, or WebP image. The file will be sent as proofImage.
          </span>
        </label>
        <input value={form.transactionReference} onChange={(event) => setForm({ ...form, transactionReference: event.target.value })} placeholder="Transaction reference (optional)" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
        <input value={form.senderPhone} onChange={(event) => setForm({ ...form, senderPhone: event.target.value })} placeholder="Sender phone (optional)" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
        <input value={form.senderName} onChange={(event) => setForm({ ...form, senderName: event.target.value })} placeholder="Sender name (optional)" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
        <input value={form.paidAmount} onChange={(event) => setForm({ ...form, paidAmount: event.target.value })} type="number" placeholder="Paid amount (optional)" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
        <button disabled={loading} className="cursor-pointer w-full rounded-full bg-primary py-4 font-black uppercase text-white disabled:opacity-60 flex items-center justify-center gap-2"><Upload size={18} />Submit Proof</button>
      </form>
    </div>
  );
}
