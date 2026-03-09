import { create } from "zustand";

export type HeaderNav = "home" | "categories" | "popular" | "feedback" | "admin" | "articles" | null;
export type HeaderActionId =
  | "copy_link"
  | "print"
  | "helpful"
  | "report_outdated"
  | "suggest_improvement"
  | "request_article"
  | "custom";

export interface HeaderAction {
  id: HeaderActionId;
  label: string;
  description?: string;
  href?: string;
  icon?: string;
  variant?: "primary" | "ghost" | "destructive";
  onClick?: () => void;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
}

interface UIState {
  activeNav: HeaderNav;
  headerActions: HeaderAction[];
  mobileActionBarVisible: boolean;
  toasts: ToastMessage[];
  setActiveNav: (nav: HeaderNav) => void;
  setHeaderActions: (actions: HeaderAction[]) => void;
  setMobileActionBarVisible: (visible: boolean) => void;
  pushToast: (toast: ToastMessage) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeNav: null,
  headerActions: [],
  mobileActionBarVisible: false,
  toasts: [],
  setActiveNav: (nav) => set({ activeNav: nav }),
  setHeaderActions: (actions) => set({ headerActions: actions }),
  setMobileActionBarVisible: (visible) => set({ mobileActionBarVisible: visible }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.id !== toast.id), toast],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));
