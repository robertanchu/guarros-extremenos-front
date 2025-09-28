// src/store/toast.js
import { create } from "zustand";

let _id = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  add: ({ title, message, variant = "info", duration = 3500 }) => {
    const id = ++_id;
    const t = { id, title, message, variant, createdAt: Date.now(), duration };
    set((s) => ({ toasts: [...s.toasts, t] }));
    // auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        const { remove } = get();
        remove(id);
      }, duration);
    }
    return id;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = (opts) => {
  try {
    return useToastStore.getState().add(opts);
  } catch {
    // fallback silencioso si la store aún no está montada
    console.warn("Toast store not ready", opts);
  }
};
