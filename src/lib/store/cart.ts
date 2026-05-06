import { create } from 'zustand'

export type CartItem = {
	book_id: string
	slug: string
	title: string
	author: string
	price: number
	cover_image_path: string | null
	quantity: number
	stock: number
}

interface CartStore {
	items: CartItem[]
	isOpen: boolean
	addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
	removeFromCart: (book_id: string) => void
	updateQuantity: (book_id: string, qty: number) => void
	clearCart: () => void
	setCartOpen: (open: boolean) => void
}

const loadCart = (): CartItem[] => {
	if (globalThis.window === undefined) return []
	try {
		const raw = globalThis.window.localStorage.getItem('buho-cart')
		if (raw) return JSON.parse(raw)
	} catch {}
	return []
}

const saveCart = (items: CartItem[]) => {
	if (globalThis.window !== undefined) {
		globalThis.window.localStorage.setItem('buho-cart', JSON.stringify(items))
	}
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: loadCart(),
	isOpen: false,
	addToCart: (item, qty = 1) => {
		set((state) => {
			const existing = state.items.find((c) => c.book_id === item.book_id)
			let newItems: CartItem[]
			if (existing) {
				const nextQty = Math.min(existing.quantity + qty, item.stock)
				newItems = state.items.map((c) =>
					c.book_id === item.book_id ? { ...c, quantity: nextQty } : c,
				)
			} else {
				newItems = [
					...state.items,
					{ ...item, quantity: Math.min(qty, item.stock) },
				]
			}
			saveCart(newItems)
			return { items: newItems }
		})
	},
	removeFromCart: (book_id) => {
		set((state) => {
			const newItems = state.items.filter((c) => c.book_id !== book_id)
			saveCart(newItems)
			return { items: newItems }
		})
	},
	updateQuantity: (book_id, qty) => {
		const store = get()
		if (qty <= 0) {
			store.removeFromCart(book_id)
			return
		}
		set((state) => {
			const newItems = state.items.map((c) =>
				c.book_id === book_id ? { ...c, quantity: Math.min(qty, c.stock) } : c,
			)
			saveCart(newItems)
			return { items: newItems }
		})
	},
	clearCart: () => {
		saveCart([])
		set({ items: [] })
	},
	setCartOpen: (isOpen) => set({ isOpen }),
}))
