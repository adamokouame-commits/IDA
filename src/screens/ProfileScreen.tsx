import React, { useState } from 'react';
import {
  User as UserIcon,
  LogIn,
  LogOut,
  Edit3,
  ShieldCheck,
  Bell,
  MapPin,
  Mail,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutLocally } from '../store/authSlice';
import { setActiveModal, showToast } from '../store/uiSlice';
import { loginWithGoogle, logoutUser } from '../services/firebase';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, currentUser, profile, isLoading } = useAppSelector((state) => state.auth);
  const bookmarkedCount = useAppSelector((state) => state.bookmarks.bookmarkedIds.length);
  const items = useAppSelector((state) => state.feed.items);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Compute stats
  const publishedCount = items.filter(
    (item) => item.authorId === currentUser?.uid || (currentUser && item.authorName === profile?.displayName)
  ).length;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
      dispatch(
        showToast({
          message: 'Connexion Firebase réussie !',
          type: 'success',
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message: 'Erreur lors de la connexion Firebase Google',
          type: 'error',
        })
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      dispatch(logoutLocally());
      dispatch(
        showToast({
          message: 'Déconnexion effectuée',
          type: 'info',
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const displayAvatar =
    profile?.photoURL ||
    currentUser?.photoURL ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const displayName = profile?.displayName || currentUser?.displayName || 'Voyageur Nova';
  const displayEmail = profile?.email || currentUser?.email || 'compte-visiteur@novahub.app';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 scrollbar-none">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Profil & Identité
            </span>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">Mon Compte Firebase</h1>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => dispatch(setActiveModal('editProfile'))}
              className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
              title="Modifier le profil"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-18 h-18 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                  isAuthenticated ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                title={isAuthenticated ? 'Authentifié Firebase' : 'Mode Démo Visiteur'}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {displayName}
                </h2>
                {isAuthenticated && <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 shrink-0" />
                <span>{displayEmail}</span>
              </p>

              {profile?.location && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>
          </div>

          {profile?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
              <span className="block text-base font-black text-slate-900 dark:text-white">
                {publishedCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Publications</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
              <span className="block text-base font-black text-indigo-600 dark:text-indigo-400">
                {bookmarkedCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Favoris</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
              <span className="block text-base font-black text-rose-500">
                {items.reduce((acc, i) => acc + (i.likesCount || 0), 0)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">J'aime reçus</span>
            </div>
          </div>
        </div>

        {/* Authentication Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Statut d'Authentification</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAuthenticated
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {isAuthenticated ? 'Connecté (Firebase)' : 'Session Locale'}
            </span>
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Connecté avec le compte Google <strong className="text-slate-700 dark:text-slate-200">{currentUser?.email}</strong>.
                Vos favoris et profils sont synchronisés dans Firestore.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Connectez-vous avec Firebase pour sauvegarder vos profils personnalisés, vos créations de liens et vos favoris dans le Cloud.
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSigningIn ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Technical Architecture Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Architecture & Pile Technique</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Gestionnaire d’état global</span>
              <strong className="text-slate-800 dark:text-slate-200">Redux Toolkit (RTK)</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Authentification & BDD</span>
              <strong className="text-slate-800 dark:text-slate-200">Firebase Auth & Firestore</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Architecture modulaire</span>
              <strong className="text-slate-800 dark:text-slate-200">Écrans & Composants React Native</strong>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Moteur d'images dynamiques</span>
              <strong className="text-slate-800 dark:text-slate-200">HTML Parser & Vector Studio</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
