"use client";

import { create } from "zustand";
import type { Tier } from "@/lib/pricing";

interface CheckoutState {
  open: boolean;
  tier: Tier;
  setOpen: (open: boolean) => void;
  openCheckout: (tier?: Tier) => void;
  close: () => void;
}

export const useCheckout = create<CheckoutState>((set) => ({
  open: false,
  tier: "early_bird",
  setOpen: (open) => set({ open }),
  openCheckout: (tier = "early_bird") => set({ open: true, tier }),
  close: () => set({ open: false }),
}));
