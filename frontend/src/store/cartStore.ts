import { create } from 'zustand';

interface CartItem {
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  setCart: (items: CartItem[], total: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  setCart: (items, total) => set({ items, total }),
  clearCart: () => set({ items: [], total: 0 }),
}));

