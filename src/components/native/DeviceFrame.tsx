import React from 'react';
import { Smartphone, Monitor, Palette, Sparkles, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleDeviceViewMode, setPhoneModel } from '../../store/uiSlice';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';
import { Toast } from './Toast';
import { ItemDetailModal } from '../modals/ItemDetailModal';
import { CreatePostModal } from '../modals/CreatePostModal';
import { EditProfileModal } from '../modals/EditProfileModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { deviceViewMode, selectedPhoneModel } = useAppSelector((state) => state.ui);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-indigo-500 selection:text-white">
      {/* Top Development & Architecture Bar */}
      <header className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 py-2 px-3 mb-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-tight text-white">Nova Native</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            React Native Components + RTK
          </span>
          <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Firebase Auth Active</span>
          </span>
        </div>

        {/* Viewport and Model Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => dispatch(setPhoneModel('iphone'))}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedPhoneModel === 'iphone'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              iOS
            </button>
            <button
              onClick={() => dispatch(setPhoneModel('android'))}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedPhoneModel === 'android'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Android
            </button>
          </div>

          <button
            onClick={() => dispatch(toggleDeviceViewMode())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Basculer entre le châssis mobile et le plein écran"
          >
            {deviceViewMode === 'device' ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Plein Écran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Châssis Mobile</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0">
        {deviceViewMode === 'device' ? (
          /* Realistic Native Mobile Shell */
          <div
            className={`relative w-full max-w-[412px] h-[840px] max-h-[92vh] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#1e293b,0_0_0_14px_#334155] flex flex-col overflow-hidden transition-all duration-300`}
          >
            {/* Screen Inner */}
            <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[38px] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
              {/* Native Status Bar */}
              <StatusBar model={selectedPhoneModel} />

              {/* Toast messages */}
              <Toast />

              {/* Active Screen Content */}
              <div className="relative flex-1 overflow-hidden flex flex-col">{children}</div>

              {/* Native Bottom Tab Bar */}
              <TabBar />

              {/* Modals & Sheets */}
              <ItemDetailModal />
              <CreatePostModal />
              <EditProfileModal />
            </div>
          </div>
        ) : (
          /* Fluid Tablet / Full Viewport Mode */
          <div className="relative w-full max-w-4xl h-[860px] max-h-[92vh] bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
            <StatusBar model={selectedPhoneModel} />
            <Toast />
            <div className="relative flex-1 overflow-hidden flex flex-col">{children}</div>
            <TabBar />
            <ItemDetailModal />
            <CreatePostModal />
            <EditProfileModal />
          </div>
        )}
      </main>
    </div>
  );
};
