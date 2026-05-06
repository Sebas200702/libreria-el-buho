import { formatPrice } from './format'
import type { CartItem } from '../store/cart'

const DEFAULT_NUMBER = '573000000000'

function getNumber(): string {
	if (
		typeof import.meta !== 'undefined' &&
		import.meta.env?.PUBLIC_WHATSAPP_NUMBER
	) {
		return import.meta.env.PUBLIC_WHATSAPP_NUMBER as string
	}
	return DEFAULT_NUMBER
}

export function buildWhatsappLink(message: string, number?: string): string {
	const phone = (number ?? getNumber()).replace(/\D/g, '')
	return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Message for a quick inquiry about a single book.
 */
export function whatsappBookInquiry(params: {
	title: string
	author: string
	price: number
	url?: string
}): string {
	const { title, author, price, url } = params
	const lines = [
		`Hola 🦉 Librería del Búho`,
		``,
		`Me interesa este libro:`,
		`• ${title} — ${author}`,
		`• Precio: ${formatPrice(price)}`,
	]
	if (url) lines.push(`• Enlace: ${url}`)
	lines.push('', '¿Está disponible?')
	return lines.join('\n')
}

/**
 * Message sent after a pedido is created (with order ID).
 * Used to coordinate payment & entrega.
 */
export function whatsappOrderConfirmation(params: {
	orderId: string
	items: CartItem[]
	total: number
	customerName?: string
}): string {
	const { orderId, items, total, customerName } = params
	const shortId = orderId.slice(0, 8).toUpperCase()
	const lines = [
		`Hola 🦉 Librería del Búho`,
		``,
		`Acabo de hacer un pedido en la web.`,
		customerName ? `Nombre: ${customerName}` : null,
		`Referencia: #${shortId}`,
		``,
		`Libros:`,
		...items.map(
			(i) =>
				`• ${i.title} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
		),
		``,
		`Total: ${formatPrice(total)}`,
		``,
		`¿Cómo coordinamos pago y entrega? 🙏`,
	].filter(Boolean)
	return lines.join('\n')
}

/**
 * Quick cart-to-whatsapp message without going through DB order.
 */
export function whatsappCartQuickOrder(params: {
	items: CartItem[]
	total: number
}): string {
	const { items, total } = params
	const lines = [
		`Hola 🦉 Librería del Búho`,
		``,
		`Me gustaría pedir estos libros:`,
		...items.map(
			(i) =>
				`• ${i.title} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
		),
		``,
		`Total estimado: ${formatPrice(total)}`,
		``,
		`¿Cómo coordinamos?`,
	]
	return lines.join('\n')
}
