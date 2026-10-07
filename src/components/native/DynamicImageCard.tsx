import React, { useState } from 'react';
import { Heart, Bookmark, Share2, Code2, ExternalLink } from 'lucide-react';
import { FeedItem } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleLikeItem, setSelectedItem } from '../../store/feedSlice';
import { toggleBookmark } from '../../store/bookmarksSlice';
import { setActiveModal, showToast } from '../../store/uiSlice';
import { toggleBookmarkDoc, updateLikeCount } from '../../services/firebase';

interface DynamicImageCardProps {
  item: FeedItem;
  viewMode?: 'card' | 'compact';
}

export const DynamicImageCard: React.FC<DynamicImageCardProps> = ({ item, viewMode = 'card' }) => {
  const dispatch = useAppDispatch();
  const liked = useAppSelector((state) => state.feed.likedItemIds.includes(item.id));
  const bookmarked = useAppSelector((state) => state.bookmarks.bookmarkedIds.includes(item.id));
  const user = useAppSelector((state) => state.auth.currentUser);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLikeItem(item.id));
    const nextCount = (item.likesCount || 0) + (liked ? -1 : 1);
    updateLikeCount(item.id, Math.max(0, nextCount)).catch(() => {
      // optimistic update fallback handled by redux
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = !bookmarked;
    dispatch(toggleBookmark(item.id));
    dispatch(
      showToast({
        message: nextStatus ? 'Ajouté à vos favoris' : 'Retiré des favoris',
        type: 'success',
      })
    );
    if (user?.uid) {
      toggleBookmarkDoc(user.uid, item.id, nextStatus).catch(console.error);
    }
  };

  const handleCopyHtmlSnippet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const snippet = `<img src="${item.imageUrl}" alt="${item.title}" loading="lazy" class="nova-responsive-img" />`;
    navigator.clipboard.writeText(snippet);
    dispatch(
      showToast({
        message: 'Lien HTML copié dans le presse-papier !',
        type: 'info',
      })
    );
  };

  const openDetail = () => {
    dispatch(setSelectedItem(item));
    dispatch(setActiveModal('itemDetail'));
  };

  return (
    <article
      onClick={openDetail}
      className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${
        viewMode === 'compact' ? 'flex flex-row p-3 gap-3 items-center' : 'flex flex-col'
      }`}
    >
      {/* Visual Header / Media */}
      <div
        className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 ${
          viewMode === 'compact' ? 'w-24 h-24 rounded-xl shrink-0' : 'w-full aspect-4/3'
        }`}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
        )}

        <img
          src={imageError ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' : item.imageUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dynamic Category Tag Overlay */}
        {viewMode === 'card' && item.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full bg-slate-950/70 backdrop-blur-md text-white border border-white/10 shadow-xs">
            {item.category}
          </span>
        )}

        {/* Quick HTML Inspector Button */}
        <button
          onClick={handleCopyHtmlSnippet}
          title="Copier le snippet HTML"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-slate-900/90 transition-colors border border-white/10"
        >
          <Code2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content */}
      <div className={`flex flex-col justify-between ${viewMode === 'compact' ? 'flex-1 min-w-0' : 'p-3.5'}`}>
        <div>
          {/* Author info */}
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={item.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
              alt={item.authorName}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
              {item.authorName}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {item.subtitle && viewMode === 'card' && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
                liked
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 ${liked ? 'fill-current' : ''}`} />
              <span>{item.likesCount || 0}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                bookmarked
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-indigo-600 dark:text-slate-400'
              }`}
              title="Ajouter aux favoris"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            onClick={openDetail}
            className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
          >
            <span>Détails</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
