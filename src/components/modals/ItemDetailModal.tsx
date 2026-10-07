import React, { useState } from 'react';
import { X, Heart, Bookmark, Share2, Code, ExternalLink, Send, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveModal, showToast } from '../../store/uiSlice';
import { toggleLikeItem } from '../../store/feedSlice';
import { toggleBookmark } from '../../store/bookmarksSlice';
import { toggleBookmarkDoc, updateLikeCount } from '../../services/firebase';

export const ItemDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.feed.selectedItem);
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const liked = useAppSelector((state) => (item ? state.feed.likedItemIds.includes(item.id) : false));
  const bookmarked = useAppSelector((state) => (item ? state.bookmarks.bookmarkedIds.includes(item.id) : false));
  const user = useAppSelector((state) => state.auth.currentUser);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Sublime lumière et palette de couleurs !',
    'Le rendu dynamique sur mobile est vraiment fluide.',
  ]);
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'itemDetail' || !item) return null;

  const handleClose = () => {
    dispatch(setActiveModal('none'));
  };

  const handleLike = () => {
    dispatch(toggleLikeItem(item.id));
    const nextCount = (item.likesCount || 0) + (liked ? -1 : 1);
    updateLikeCount(item.id, Math.max(0, nextCount)).catch(console.error);
  };

  const handleBookmark = () => {
    const nextStatus = !bookmarked;
    dispatch(toggleBookmark(item.id));
    dispatch(
      showToast({
        message: nextStatus ? 'Ajouté aux favoris' : 'Retiré des favoris',
        type: 'success',
      })
    );
    if (user?.uid) {
      toggleBookmarkDoc(user.uid, item.id, nextStatus).catch(console.error);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, commentText.trim()]);
    setCommentText('');
    dispatch(showToast({ message: 'Commentaire ajouté !', type: 'success' }));
  };

  const htmlSnippet = `<figure class="nova-embed">
  <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
  <figcaption>${item.title} — Par ${item.authorName}</figcaption>
</figure>`;

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    dispatch(showToast({ message: 'Code HTML copié !', type: 'info' }));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full max-h-[92%] bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {item.category || 'Détails'}
          </span>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none pb-6">
          {/* Main Image */}
          <div className="relative w-full aspect-4/3 bg-slate-950">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              {item.category}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Title & Actions */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h2>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      liked
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                    <span>{item.likesCount || 0}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full transition-all ${
                      bookmarked
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {item.subtitle && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.subtitle}
                </p>
              )}
            </div>

            {/* Author Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <img
                src={item.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt={item.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {item.authorName}
                </span>
                <span className="text-[10px] text-slate-400">Créateur certifié</span>
              </div>
            </div>

            {/* HTML Dynamic Link Code Section */}
            <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-indigo-400">
                  <Code className="w-3.5 h-3.5" />
                  <span>Snippet HTML dynamique</span>
                </span>
                <button
                  onClick={copyHtml}
                  className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
              <pre className="font-mono text-[10px] text-slate-300 bg-slate-950 p-2.5 rounded-xl overflow-x-auto whitespace-pre-wrap break-all">
                {htmlSnippet}
              </pre>
            </div>

            {/* Comments List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Commentaires ({comments.length})
              </span>
              <div className="space-y-2">
                {comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80"
                  >
                    {comment}
                  </div>
                ))}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Écrire un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
