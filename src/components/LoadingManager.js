import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: true,
  setLoading: (state) => set({ isLoading: state }),
}));

export default useLoadingStore;
