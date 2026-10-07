import React, { useState } from 'react';
import { X, Save, User, MapPin, AlignLeft, Image } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveModal, showToast } from '../../store/uiSlice';
import { updateProfileLocally } from '../../store/authSlice';
import { updateUserProfile } from '../../services/firebase';

export const EditProfileModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const profile = useAppSelector((state) => state.auth.profile);
  const user = useAppSelector((state) => state.auth.currentUser);

  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || 'Voyageur Nova');
  const [bio, setBio] = useState(profile?.bio || 'Passionné de design mobile et de photographie.');
  const [location, setLocation] = useState(profile?.location || 'Paris, France');
  const [photoURL, setPhotoURL] = useState(
    profile?.photoURL ||
      user?.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [saving, setSaving] = useState(false);

  if (activeModal !== 'editProfile') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      photoURL: photoURL.trim(),
    };

    dispatch(updateProfileLocally(updated));

    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, updated);
      } catch (err) {
        console.error('Failed to sync to firebase:', err);
      }
    }

    dispatch(showToast({ message: 'Profil mis à jour avec succès !', type: 'success' }));
    setSaving(false);
    dispatch(setActiveModal('none'));
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full max-h-[85%] bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Modifier mon profil</span>
          <button
            onClick={() => dispatch(setActiveModal('none'))}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
          {/* Avatar preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <img src={photoURL} alt="Avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40" />
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                Lien dynamique de l'avatar (HTML / URL)
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-mono border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Localisation
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Biographie
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
