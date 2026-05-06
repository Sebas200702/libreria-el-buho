export interface OrderItem {
	id: string
	book_id: string
	title_snapshot: string
	quantity: number
	unit_price: number
}

export interface Order {
	id: string
	customer_name: string
	customer_email: string
	customer_phone: string | null
	notes: string | null
	status: 'pending' | 'completed' | 'canceled'
	total: number
	created_at: string
	items?: OrderItem[]
}

export interface OrderTableProps {
	initialOrders: Order[]
}

export const STATUSES: Array<{ key: Order['status'] | 'all'; label: string }> =
	[
		{ key: 'all', label: 'Todos' },
		{ key: 'pending', label: 'Pendientes' },
		{ key: 'completed', label: 'Entregados' },
		{ key: 'canceled', label: 'Cancelados' },
	]
