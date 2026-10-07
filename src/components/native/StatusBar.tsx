import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface StatusBarProps {
  model?: 'iphone' | 'android';
}

export const StatusBar: React.FC<StatusBarProps> = ({ model = 'iphone' }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-11 px-6 flex items-center justify-between text-xs font-semibold select-none z-30 shrink-0 text-slate-800 dark:text-slate-100">
      {/* Time on left for iPhone / center-left for Android */}
      <span className="tracking-tight text-[13px] font-medium">{time || '09:41'}</span>

      {/* Dynamic Island / Camera Notch simulator */}
      {model === 'iphone' ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-24 bg-black rounded-full flex items-center justify-center px-2 gap-1.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse ml-auto" />
        </div>
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-700" />
      )}

      {/* Icons Right */}
      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
        <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 fill-current" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
