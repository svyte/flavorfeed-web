import { create } from 'zustand';

interface RootState {
  // TODO: Add slices (auth, user, restaurant, etc.)
}

export const useRootStore = create<RootState>(() => ({})); 