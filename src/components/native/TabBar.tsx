import React from 'react';
import { Compass, Sparkles, Bookmark, User } from 'lucide-react';
import { RootTab } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCurrentTab } from '../../store/uiSlice';

export const TabBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((state) => state.ui.currentTab);
  const bookmarkedCount = useAppSelector((state) => state.bookmarks.bookmarkedIds.length);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const tabs: { key: RootTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: 'feed',
      label: 'Explorer',
      icon: <Compass className="w-5 h-5 transition-transform group-hover:scale-110" />,
    },
    {
      key: 'studio',
      label: 'Studio Liens',
      icon: <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />,
    },
    {
      key: 'bookmarks',
      label: 'Favoris',
      icon: <Bookmark className="w-5 h-5 transition-transform group-hover:scale-110" />,
      badge: bookmarkedCount > 0 ? bookmarkedCount : undefined,
    },
    {
      key: 'profile',
      label: 'Profil',
      icon: <User className="w-5 h-5 transition-transform group-hover:scale-110" />,
      badge: !isAuthenticated ? 1 : undefined,
    },
  ];

  return (
    <div className="relative w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-1.5 pb-5 z-20 shrink-0">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => dispatch(setCurrentTab(tab.key))}
              className={`group relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-in fade-in zoom-in duration-150" />
              )}
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                      tab.key === 'profile' && !isAuthenticated ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  >
                    {tab.key === 'profile' && !isAuthenticated ? '!' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Home Indicator line */}
      <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 opacity-60" />
    </div>
  );
};
