import React from 'react';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { DynamicImageCard } from '../components/native/DynamicImageCard';
import { setCurrentTab } from '../store/uiSlice';

export const BookmarksScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const bookmarkedIds = useAppSelector((state) => state.bookmarks.bookmarkedIds);
  const allItems = useAppSelector((state) => state.feed.items);

  const bookmarkedItems = allItems.filter((item) => bookmarkedIds.includes(item.id));

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 scrollbar-none">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Bookmark className="w-4 h-4 fill-current" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Favoris & Sauvegardes</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              {bookmarkedItems.length} Élément{bookmarkedItems.length > 1 ? 's' : ''} enregistré{bookmarkedItems.length > 1 ? 's' : ''}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {bookmarkedItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Aucun favori pour le moment
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
              Explorez le flux ou générez des liens d’images dynamiques pour les ajouter à vos favoris.
            </p>
            <button
              onClick={() => dispatch(setCurrentTab('feed'))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              <span>Découvrir le flux</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          bookmarkedItems.map((item) => (
            <DynamicImageCard key={item.id} item={item} viewMode="card" />
          ))
        )}
      </div>
    </div>
  );
};
