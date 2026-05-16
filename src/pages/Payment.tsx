import { FormEvent, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BadgePercent, ShieldCheck, Upload } from 'lucide-react';
import { EmptyState } from '../components/AsyncState';
import GlobalLoader from '../components/GlobalLoader';
import { formatPrice } from '../lib/format';
import { useToast } from '../lib/toast';
import { useCheckoutStore } from '../stores/checkout.store';

function getInstructionAmount(instructions: Record<string, unknown> | null, key: string) {
  const value = instructions?.[key];
  const amount = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(amount) ? amount : null;
}

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

  const exactAmount = getInstructionAmount(paymentInstructions, 'exactAmount');
  const depositAmount = exactAmount ? exactAmount * 0.1 : null;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <Link to={`/order/${orderId}`} className="text-sm font-black uppercase text-primary">Back to order</Link>
      <h1 className="mt-6 text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">Payment Instructions</h1>
      {error ? <div className="mt-8"><EmptyState title="Could not load instructions" body={error} /></div> : null}
      <section className="mt-8 border border-zinc-800 bg-zinc-950 p-8">
        {loading && !paymentInstructions ? <GlobalLoader label="Loading payment instructions" className="min-h-48" /> : (
          <div className="space-y-6">
            {depositAmount ? (
              <div className="relative overflow-hidden border border-primary/50 bg-gradient-to-br from-primary/20 via-zinc-950 to-emerald-950/30 p-6 shadow-2xl shadow-primary/10">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/20 blur-2xl" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-black text-primary">
                      <BadgePercent size={24} />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Required deposit</p>
                      <h2 className="mt-2 text-2xl font-black uppercase text-white md:text-3xl">Pay 10% per minimum to confirm your order</h2>
                      <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-zinc-300">
                        Please send 10% per minimum of the exact order amount now. Your order will be confirmed after we review the payment proof.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 border border-white/10 bg-black/60 p-5 text-left md:text-right">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Send now</span>
                    <strong className="mt-1 block text-3xl font-black text-white">{formatPrice(depositAmount)}</strong>
                    <span className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 md:justify-end">
                      <ShieldCheck size={14} />
                      10% of {formatPrice(exactAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
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
        <input value={form.paidAmount} onChange={(event) => setForm({ ...form, paidAmount: event.target.value })} type="number" placeholder={depositAmount ? `Paid amount: ${formatPrice(depositAmount)}` : 'Paid amount (optional)'} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white" />
        <button disabled={loading} className="cursor-pointer w-full rounded-full bg-primary py-4 font-black uppercase text-white disabled:opacity-60 flex items-center justify-center gap-2"><Upload size={18} />Submit Proof</button>
      </form>
    </div>
  );
}
