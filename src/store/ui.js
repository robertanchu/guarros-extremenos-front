import { create } from "zustand";
export const useUI = create((set)=> ({
  cartOpen:false,
  cartPulse:false,
  pulseCart:()=>{ set({ cartPulse:true }); setTimeout(()=> set({ cartPulse:false }), 600); },
  openCart:()=> set({ cartOpen:true }),
  closeCart:()=> set({ cartOpen:false }),
  toggleCart:()=> set((s)=> ({ cartOpen: !s.cartOpen })),
}));
