import { createContext, ReactNode, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

type ToastContextValue = {
  notify: (message: string, type?: Toast['type']) => void;
};

const ToastContext = createContext<ToastContextValue>({
  notify: () => undefined,
});

const toastConfig = {
  success: {
    icon: CheckCircle2,
    wrapper:
      'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-emerald-900/10',
    iconBox: 'bg-emerald-100 text-emerald-700',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    wrapper: 'border-red-200 bg-red-50 text-red-950 shadow-red-900/10',
    iconBox: 'bg-red-100 text-red-700',
    progress: 'bg-red-500',
  },
  info: {
    icon: Info,
    wrapper: 'border-zinc-200 bg-white text-zinc-950 shadow-zinc-900/10',
    iconBox: 'bg-zinc-100 text-zinc-700',
    progress: 'bg-primary',
  },
} satisfies Record<
  Toast['type'],
  {
    icon: typeof Info;
    wrapper: string;
    iconBox: string;
    progress: string;
  }
>;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const notify = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();

    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      <div className="fixed right-4 top-24 z-[80] flex w-[min(390px,calc(100vw-2rem))] flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{
                  opacity: 0,
                  x: 40,
                  scale: 0.96,
                  filter: 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  x: 40,
                  scale: 0.96,
                  filter: 'blur(6px)',
                }}
                transition={{
                  duration: 0.28,
                  ease: 'easeOut',
                }}
                role="status"
                className={`relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur ${config.wrapper}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBox}`}
                  >
                    <Icon size={21} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-black uppercase tracking-wide">
                      {toast.type === 'success'
                        ? 'Success'
                        : toast.type === 'error'
                          ? 'Error'
                          : 'Info'}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5 opacity-80">
                      {toast.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-50 transition hover:bg-black/5 hover:opacity-100"
                    aria-label="Close notification"
                  >
                    <X size={16} />
                  </button>
                </div>

                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: 3.5,
                    ease: 'linear',
                  }}
                  className={`absolute bottom-0 left-0 h-1 w-full origin-left ${config.progress}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}