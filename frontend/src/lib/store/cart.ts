import { atom, computed } from 'nanostores';
import { persistentAtom } from './persistent';

export type CartItem = {
  book_id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  cover_image_path: string | null;
  quantity: number;
  stock: number;
};

export const cartAtom = persistentAtom<CartItem[]>('buho-cart', []);

export const cartCount = computed(cartAtom, (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0),
);

export const cartTotal = computed(cartAtom, (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0),
);

export function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1) {
  const current = cartAtom.get();
  const existing = current.find((c) => c.book_id === item.book_id);
  if (existing) {
    const nextQty = Math.min(existing.quantity + qty, item.stock);
    cartAtom.set(
      current.map((c) =>
        c.book_id === item.book_id ? { ...c, quantity: nextQty } : c,
      ),
    );
  } else {
    cartAtom.set([...current, { ...item, quantity: Math.min(qty, item.stock) }]);
  }
}

export function removeFromCart(book_id: string) {
  cartAtom.set(cartAtom.get().filter((c) => c.book_id !== book_id));
}

export function updateQuantity(book_id: string, qty: number) {
  if (qty <= 0) return removeFromCart(book_id);
  cartAtom.set(
    cartAtom.get().map((c) =>
      c.book_id === book_id ? { ...c, quantity: Math.min(qty, c.stock) } : c,
    ),
  );
}

export function clearCart() {
  cartAtom.set([]);
}

export const isCartOpen = atom(false);
