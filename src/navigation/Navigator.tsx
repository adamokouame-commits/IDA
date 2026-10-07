import React from 'react';
import { useAppSelector } from '../store';
import { FeedScreen } from '../screens/FeedScreen';
import { DynamicImageStudioScreen } from '../screens/DynamicImageStudioScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export const Navigator: React.FC = () => {
  const currentTab = useAppSelector((state) => state.ui.currentTab);

  switch (currentTab) {
    case 'feed':
      return <FeedScreen />;
    case 'studio':
      return <DynamicImageStudioScreen />;
    case 'bookmarks':
      return <BookmarksScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <FeedScreen />;
  }
};
