import { useMemo, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import type { Order, OrderItem } from './types'

export const useOrderTable = (initialOrders: Order[]) => {
	const [orders, setOrders] = useState<Order[]>(initialOrders)
	const [filter, setFilter] = useState<Order['status'] | 'all'>('all')
	const [expanded, setExpanded] = useState<Record<string, boolean>>({})
	const [itemsCache, setItemsCache] = useState<Record<string, OrderItem[]>>({})
	const [busy, setBusy] = useState<Record<string, boolean>>({})
	const [err, setErr] = useState('')

	const visible = useMemo(
		() =>
			filter === 'all'
				? orders
				: orders.filter((order) => order.status === filter),
		[filter, orders],
	)

	const counts = useMemo(
		() => ({
			all: orders.length,
			pending: orders.filter((order) => order.status === 'pending').length,
			completed: orders.filter((order) => order.status === 'completed').length,
			canceled: orders.filter((order) => order.status === 'canceled').length,
		}),
		[orders],
	)

	const toggle = async (id: string): Promise<void> => {
		setExpanded((state) => ({ ...state, [id]: !state[id] }))
		if (itemsCache[id]) return

		const supabase = getBrowserSupabase()
		const { data } = await supabase
			.from('order_items')
			.select('id, book_id, title_snapshot, quantity, unit_price')
			.eq('order_id', id)
		setItemsCache((state) => ({ ...state, [id]: (data ?? []) as OrderItem[] }))
	}

	const act = async (
		id: string,
		action: 'complete' | 'cancel',
	): Promise<void> => {
		setErr('')
		setBusy((state) => ({ ...state, [id]: true }))
		const supabase = getBrowserSupabase()
		const rpc =
			action === 'complete'
				? supabase.rpc('complete_order', { order_uuid: id })
				: supabase.rpc('cancel_order', { order_uuid: id })
		const { error } = await rpc
		setBusy((state) => ({ ...state, [id]: false }))
		if (error) {
			setErr(error.message)
			return
		}
		setOrders((state) =>
			state.map((order) =>
				order.id === id
					? {
							...order,
							status: action === 'complete' ? 'completed' : 'canceled',
						}
					: order,
			),
		)
	}

	return {
		filter,
		setFilter,
		expanded,
		itemsCache,
		busy,
		err,
		visible,
		counts,
		toggle,
		act,
	}
}
