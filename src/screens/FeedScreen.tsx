import React, { useState } from 'react';
import { Search, Plus, SlidersHorizontal, LayoutGrid, Rows3, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSelectedCategory, setSearchQuery } from '../store/feedSlice';
import { setActiveModal } from '../store/uiSlice';
import { DynamicImageCard } from '../components/native/DynamicImageCard';

const CATEGORIES = ['Tous', 'Nature', 'Architecture', 'Urban', 'Design', 'Art'];

const STORIES = [
  { id: '1', name: 'Toi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isUser: true },
  { id: '2', name: 'Éléonore', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '3', name: 'Marc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '4', name: 'Kenji', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '5', name: 'Clara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: false },
  { id: '6', name: 'Julien', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', active: false },
];

export const FeedScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.feed.items);
  const selectedCategory = useAppSelector((state) => state.feed.selectedCategory);
  const searchQuery = useAppSelector((state) => state.feed.searchQuery);
  const [layoutMode, setLayoutMode] = useState<'card' | 'compact'>('card');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 scrollbar-none">
      {/* Top Mobile Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 px-4 pt-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              React Native Architecture
            </span>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Nova</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold">
                Redux + Firebase
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLayoutMode(layoutMode === 'card' ? 'compact' : 'card')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              title="Changer l'affichage"
            >
              {layoutMode === 'card' ? <Rows3 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
            <button
              onClick={() => dispatch(setActiveModal('createPost'))}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publier</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher des images, thèmes, auteurs..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stories / Reels Native Carousel */}
      <div className="pt-3 pb-2 px-4 border-b border-slate-200/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
          {STORIES.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
              <div
                className={`relative p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                  story.isUser
                    ? 'ring-2 ring-dashed ring-indigo-500/60'
                    : story.active
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px]'
                    : 'ring-1 ring-slate-300 dark:ring-slate-700'
                }`}
              >
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white dark:border-slate-900"
                />
                {story.isUser && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">
                    +
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 max-w-14 truncate">
                {story.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded-full text-slate-400 hover:text-indigo-600 transition-all ${
            isRefreshing ? 'animate-spin text-indigo-600' : ''
          }`}
          title="Rafraîchir"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Feed Content List */}
      <div className="px-4 py-2 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Aucune image trouvée
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Essayez un autre mot-clé ou générez une image dynamique dans l’onglet Studio.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <DynamicImageCard key={item.id} item={item} viewMode={layoutMode} />
          ))
        )}
      </div>
    </div>
  );
};
