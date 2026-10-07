import React, { useState } from 'react';
import { Sparkles, Code, Link2, Copy, Play, Send, Image as ImageIcon, Sliders, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addFeedItem } from '../store/feedSlice';
import { showToast, setCurrentTab } from '../store/uiSlice';
import { createFeedDoc } from '../services/firebase';
import { FeedItem } from '../types';

export const DynamicImageStudioScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);

  // HTML source input
  const [htmlInput, setHtmlInput] = useState<string>(
    `<div class="native-card">\n  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" alt="Tech Architecture" />\n  <h2>Microprocesseur Photonique</h2>\n  <p>Composant haute densité conçu pour les processeurs quantiques de nouvelle génération.</p>\n</div>`
  );

  // Extracted or custom image url
  const [extractedUrl, setExtractedUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  );
  const [cardTitle, setCardTitle] = useState('Microprocesseur Photonique');
  const [cardCategory, setCardCategory] = useState('Tech');
  const [cardDescription, setCardDescription] = useState(
    'Composant haute densité conçu pour les processeurs quantiques de nouvelle génération.'
  );

  // Dynamic parameters
  const [aspectRatio, setAspectRatio] = useState<'4/3' | '1/1' | '16/9' | '9/16'>('4/3');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);

  // Dynamic SVG Generator Mode
  const [svgTitle, setSvgTitle] = useState('DESIGN NATIVE 2026');
  const [svgGradient, setSvgGradient] = useState<'indigo' | 'sunset' | 'emerald' | 'cyber'>('indigo');

  // Parser helper
  const handleParseHtml = () => {
    // Extract img src
    const imgSrcMatch = htmlInput.match(/<img[^>]+src=["']([^"']+)["']/i);
    // Extract background-image url
    const bgUrlMatch = htmlInput.match(/url\(["']?([^"')]+)["']?\)/i);
    // Extract h1/h2/h3 title
    const titleMatch = htmlInput.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
    // Extract paragraph
    const pMatch = htmlInput.match(/<p[^>]*>(.*?)<\/p>/i);

    const foundUrl = imgSrcMatch ? imgSrcMatch[1] : bgUrlMatch ? bgUrlMatch[1] : null;

    if (foundUrl) {
      setExtractedUrl(foundUrl);
      if (titleMatch && titleMatch[1]) setCardTitle(titleMatch[1].replace(/<[^>]+>/g, ''));
      if (pMatch && pMatch[1]) setCardDescription(pMatch[1].replace(/<[^>]+>/g, ''));

      dispatch(
        showToast({
          message: 'Lien image et contenu extraits avec succès !',
          type: 'success',
        })
      );
    } else {
      dispatch(
        showToast({
          message: 'Aucune balise <img> ou url() détectée dans le HTML',
          type: 'error',
        })
      );
    }
  };

  const handleGenerateSvgDataUri = () => {
    const gradients = {
      indigo: ['#4f46e5', '#9333ea'],
      sunset: ['#f97316', '#ec4899'],
      emerald: ['#059669', '#0d9488'],
      cyber: ['#06b6d4', '#3b82f6'],
    };
    const [c1, c2] = gradients[svgGradient];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)" />
      <circle cx="400" cy="300" r="180" fill="rgba(255,255,255,0.08)" />
      <circle cx="200" cy="150" r="120" fill="rgba(255,255,255,0.05)" />
      <text x="400" y="280" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle">${svgTitle}</text>
      <text x="400" y="340" font-family="system-ui, sans-serif" font-weight="500" font-size="22" fill="rgba(255,255,255,0.85)" text-anchor="middle">Généré dynamiquement en HTML/SVG</text>
    </svg>`;

    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setExtractedUrl(dataUri);
    setCardTitle(svgTitle);
    setCardCategory('Graphisme');
    dispatch(
      showToast({
        message: 'Lien dynamique SVG vectoriel généré !',
        type: 'success',
      })
    );
  };

  const handlePublishToFeed = async () => {
    if (!extractedUrl) {
      dispatch(showToast({ message: 'Veuillez définir une URL d’image', type: 'error' }));
      return;
    }

    const newItem: FeedItem = {
      id: `nova-item-${Date.now()}`,
      title: cardTitle || 'Sans titre',
      subtitle: cardDescription,
      category: cardCategory || 'Dynamique',
      imageUrl: extractedUrl,
      authorId: user?.uid || 'guest_user',
      authorName: user?.displayName || 'Studio Créateur',
      authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch(addFeedItem(newItem));
    if (user?.uid) {
      createFeedDoc(newItem).catch(console.error);
    }
    dispatch(showToast({ message: 'Carte publiée dans le Feed avec succès !', type: 'success' }));
    dispatch(setCurrentTab('feed'));
  };

  const generatedHtmlExport = `<figure class="nova-dynamic-card">
  <img src="${extractedUrl}" alt="${cardTitle}" style="filter: brightness(${brightness}%) contrast(${contrast}%)${grayscale ? ' grayscale(100%)' : ''};" />
  <figcaption>
    <span class="category">${cardCategory}</span>
    <h3>${cardTitle}</h3>
    <p>${cardDescription}</p>
  </figcaption>
</figure>`;

  const copyHtmlExport = () => {
    navigator.clipboard.writeText(generatedHtmlExport);
    setIsCopied(true);
    dispatch(showToast({ message: 'Code HTML dynamique copié !', type: 'info' }));
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 scrollbar-none">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Studio de Liens Dynamiques</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">Créateur HTML ➔ Image</h1>
          </div>
          <button
            onClick={handlePublishToFeed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publier</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step 1: HTML Input & Parser */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>1. Snippet HTML Source</span>
            </span>
            <button
              onClick={handleParseHtml}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-100 flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Extraire le lien</span>
            </button>
          </div>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={4}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            placeholder="Collez du code HTML contenant <img src='...'> ou background-image: url(...)"
          />
        </div>

        {/* Dynamic Vector/Canvas SVG Generator Option */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Ou générer un visuel SVG vectoriel dynamique</span>
          </span>
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <input
              type="text"
              value={svgTitle}
              onChange={(e) => setSvgTitle(e.target.value)}
              placeholder="Texte du visuel SVG"
              className="col-span-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            />
            {(['indigo', 'sunset', 'emerald', 'cyber'] as const).map((grad) => (
              <button
                key={grad}
                onClick={() => setSvgGradient(grad)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold capitalize border transition-all ${
                  svgGradient === grad
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Dégradé {grad}
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerateSvgDataUri}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Générer le lien Data URI</span>
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span>Aperçu de la carte native</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500">Ratio {aspectRatio}</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-inner mb-3">
            <div
              className={`w-full overflow-hidden flex items-center justify-center ${
                aspectRatio === '4/3'
                  ? 'aspect-4/3'
                  : aspectRatio === '1/1'
                  ? 'aspect-square'
                  : aspectRatio === '16/9'
                  ? 'aspect-video'
                  : 'aspect-9/16 max-h-72'
              }`}
            >
              <img
                src={extractedUrl}
                alt="Aperçu dynamique"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%)${grayscale ? ' grayscale(100%)' : ''}`,
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Overlays */}
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
              {cardCategory}
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-white">
              <h4 className="text-sm font-bold line-clamp-1">{cardTitle}</h4>
              <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">{cardDescription}</p>
            </div>
          </div>

          {/* Ratio & Filters controls */}
          <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="text-slate-500">Ratio :</span>
              <div className="flex gap-1">
                {(['4/3', '1/1', '16/9', '9/16'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                      aspectRatio === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="text-slate-500 text-[10px]">Luminosité ({brightness}%)</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px]">Contraste ({contrast}%)</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grayscale}
                  onChange={(e) => setGrayscale(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Noir & Blanc (Grayscale)</span>
              </label>

              <button
                onClick={copyHtmlExport}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier le HTML final</span>
              </button>
            </div>
          </div>
        </div>

        {/* Direct Link Input / Edit */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-2.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Métadonnées de la carte
          </span>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">URL Directe</label>
            <input
              type="text"
              value={extractedUrl}
              onChange={(e) => setExtractedUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Titre</label>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Catégorie</label>
              <input
                type="text"
                value={cardCategory}
                onChange={(e) => setCardCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Description</label>
            <input
              type="text"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
