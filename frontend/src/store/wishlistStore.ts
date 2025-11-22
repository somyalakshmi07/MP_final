import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistItem {
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (productId: string, product?: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (productId: string, product?: any) => {
        const items = get().items;
        if (!items.find(item => item.productId === productId)) {
          set({
            items: [...items, { productId, product, addedAt: new Date().toISOString() }]
          });
        }
      },
      removeFromWishlist: (productId: string) => {
        set({
          items: get().items.filter(item => item.productId !== productId)
        });
      },
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.productId === productId);
      },
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

