import { createContext, ReactNode, useContext, useState } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastContextValue = { notify: (message: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextValue>({ notify: () => undefined });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-4 top-24 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border px-4 py-3 text-sm font-bold shadow-xl ${
              toast.type === 'success'
                ? 'border-emerald-700 bg-emerald-950 text-emerald-100'
                : toast.type === 'error'
                  ? 'border-primary bg-red-950 text-red-100'
                  : 'border-zinc-700 bg-zinc-950 text-zinc-100'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
