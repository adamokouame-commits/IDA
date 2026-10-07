import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearToast } from '../../store/uiSlice';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl border text-xs font-semibold ${
          toast.type === 'success'
            ? 'bg-slate-900/90 text-white border-emerald-500/40'
            : toast.type === 'error'
            ? 'bg-rose-950/90 text-white border-rose-500/40'
            : 'bg-slate-900/90 text-white border-slate-700/60'
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
        <span className="flex-1 truncate">{toast.message}</span>
        <button
          onClick={() => dispatch(clearToast())}
          className="text-slate-400 hover:text-white p-0.5 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
