/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { store, useAppDispatch } from './store';
import { setAuthState, setAuthLoading } from './store/authSlice';
import { setFeedItems } from './store/feedSlice';
import { setBookmarks } from './store/bookmarksSlice';
import { auth, db, syncUserProfile, subscribeToFeed, fetchUserBookmarks } from './services/firebase';
import { DeviceFrame } from './components/native/DeviceFrame';
import { Navigator } from './navigation/Navigator';

// Test connection on boot as mandated by Firebase Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

function MainApp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    testConnection();

    // Firebase Auth State Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      dispatch(setAuthLoading(true));
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          dispatch(
            setAuthState({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              profile,
            })
          );
          // Fetch bookmarks
          const saved = await fetchUserBookmarks(user.uid);
          if (saved.length > 0) {
            dispatch(setBookmarks(saved));
          }
        } catch (error) {
          console.error('Profile sync error:', error);
          dispatch(
            setAuthState({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              profile: null,
            })
          );
        }
      } else {
        dispatch(setAuthState({ user: null, profile: null }));
      }
    });

    // Real-time Firestore Feed Listener
    const unsubscribeFeed = subscribeToFeed((remoteItems) => {
      if (remoteItems.length > 0) {
        dispatch(setFeedItems(remoteItems));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFeed();
    };
  }, [dispatch]);

  return (
    <DeviceFrame>
      <Navigator />
    </DeviceFrame>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
