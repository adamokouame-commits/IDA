import React, { useState } from 'react';
import { X, Image as ImageIcon, Send, Sparkles, Code } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveModal, showToast } from '../../store/uiSlice';
import { addFeedItem } from '../../store/feedSlice';
import { createFeedDoc } from '../../services/firebase';
import { FeedItem } from '../../types';

export const CreatePostModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const user = useAppSelector((state) => state.auth.currentUser);
  const profile = useAppSelector((state) => state.auth.profile);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Design');
  const [imageUrl, setImageUrl] = useState('');
  const [htmlCode, setHtmlCode] = useState('');

  if (activeModal !== 'createPost') return null;

  const handleExtractFromHtml = () => {
    const match = htmlCode.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      setImageUrl(match[1]);
      dispatch(showToast({ message: 'URL extraite avec succès du code HTML !', type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Aucune balise <img src="..."> trouvée', type: 'error' }));
    }
  };

  const handleQuickPreset = (url: string, cat: string, t: string) => {
    setImageUrl(url);
    setCategory(cat);
    setTitle(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      dispatch(showToast({ message: 'Veuillez saisir au moins un titre et une image', type: 'error' }));
      return;
    }

    const newItem: FeedItem = {
      id: `nova-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      imageUrl: imageUrl.trim(),
      authorId: user?.uid || 'guest_user',
      authorName: profile?.displayName || user?.displayName || 'Voyageur Nova',
      authorAvatar:
        profile?.photoURL ||
        user?.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch(addFeedItem(newItem));
    if (user?.uid) {
      createFeedDoc(newItem).catch(console.error);
    }
    dispatch(showToast({ message: 'Publication créée avec succès !', type: 'success' }));
    dispatch(setActiveModal('none'));
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full max-h-[92%] bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Nouvelle Carte Mobile</span>
          </span>
          <button
            onClick={() => dispatch(setActiveModal('none'))}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
          {/* Presets */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Suggestions d'images rapides
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset(
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
                    'Tech',
                    'Composants Quantiques'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50"
              >
                🔬 Tech Hardware
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset(
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
                    'Nature',
                    'Cascades & Brume'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50"
              >
                🌲 Forêt Arctique
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset(
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
                    'Architecture',
                    'Villa Moderne'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50"
              >
                🏛️ Béton & Verre
              </button>
            </div>
          </div>

          {/* HTML Extraction */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span>Extraire d'un code HTML</span>
              </span>
              <button
                type="button"
                onClick={handleExtractFromHtml}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Analyser le HTML
              </button>
            </div>
            <input
              type="text"
              placeholder='<img src="https://..." />'
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              URL de l'image *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {imageUrl && (
            <div className="w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700">
              <img src={imageUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Titre *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Reflets sur le Lac Léman"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                <option value="Nature">Nature</option>
                <option value="Architecture">Architecture</option>
                <option value="Urban">Urban</option>
                <option value="Design">Design</option>
                <option value="Art">Art</option>
                <option value="Tech">Tech</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Auteur
              </label>
              <input
                type="text"
                disabled
                value={profile?.displayName || user?.displayName || 'Voyageur Nova'}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-400 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Description / Légende
            </label>
            <textarea
              rows={2}
              placeholder="Détails du sujet, contexte, focale..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publier sur le flux</span>
          </button>
        </form>
      </div>
    </div>
  );
};
