import { create } from 'zustand';

type AuthModal = 'login' | 'registration' | null;

type AuthModalStore = {
  openedModal: AuthModal;
  openLoginModal: () => void;
  openRegistrationModal: () => void;
  closeModal: () => void;
};

export const useAuthModalStore = create<AuthModalStore>()((set) => ({
  openedModal: null,
  openLoginModal: () => set({ openedModal: 'login' }),
  openRegistrationModal: () => set({ openedModal: 'registration' }),
  closeModal: () => set({ openedModal: null }),
}));
