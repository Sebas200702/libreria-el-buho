import type { CartItem } from '@/lib/store/cart'

export interface CartForm {
	customer_name: string
	customer_email: string
	customer_phone: string
	notes: string
}

export type CheckoutState = 'idle' | 'submitting' | 'success' | 'error'

export interface ConfirmedSnapshot {
	items: CartItem[]
	total: number
	customerName: string
}
