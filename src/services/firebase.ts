import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, FeedItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Fetch or create initial user profile document
export async function syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    } else {
      const newProfile: UserProfile = {
        userId: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Voyageur Nova',
        email: user.email || 'user@example.com',
        photoURL: user.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        bio: 'Passionné de design mobile, de photographie et de composants modulaires.',
        location: 'Paris, France',
        themePreference: 'system',
        notificationsEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
}

// Subscribe to public feed
export function subscribeToFeed(callback: (items: FeedItem[]) => void, onError?: (err: Error) => void) {
  const feedRef = collection(db, 'feed');
  const q = query(feedRef, limit(40));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: FeedItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ ...(doc.data() as FeedItem), id: doc.id });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'feed');
      if (onError) onError(error);
    }
  );
}

// Create new feed item
export async function createFeedDoc(item: FeedItem): Promise<void> {
  const itemRef = doc(db, 'feed', item.id);
  try {
    await setDoc(itemRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `feed/${item.id}`);
  }
}

// Toggle like count
export async function updateLikeCount(itemId: string, newCount: number): Promise<void> {
  const itemRef = doc(db, 'feed', itemId);
  try {
    await updateDoc(itemRef, { likesCount: newCount });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `feed/${itemId}`);
  }
}

// User Bookmarks
export async function fetchUserBookmarks(userId: string): Promise<string[]> {
  const colRef = collection(db, 'users', userId, 'bookmarks');
  try {
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/bookmarks`);
    return [];
  }
}

export async function toggleBookmarkDoc(userId: string, itemId: string, isSaved: boolean): Promise<void> {
  const docRef = doc(db, 'users', userId, 'bookmarks', itemId);
  try {
    if (isSaved) {
      await setDoc(docRef, { itemId, addedAt: new Date().toISOString() });
    } else {
      await deleteDoc(docRef);
    }
  } catch (error) {
    handleFirestoreError(error, isSaved ? OperationType.CREATE : OperationType.DELETE, `users/${userId}/bookmarks/${itemId}`);
  }
}
