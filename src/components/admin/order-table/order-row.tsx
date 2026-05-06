import { Check, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils/format'
import { OrderDetails } from './order-details'
import type { Order, OrderItem } from './types'

interface OrderRowProps {
	order: Order
	open: boolean
	items: OrderItem[] | undefined
	busy: boolean
	onToggle: (id: string) => void
	onAction: (id: string, action: 'complete' | 'cancel') => void
}

export const OrderRow = ({
	order,
	open,
	items,
	busy,
	onToggle,
	onAction,
}: OrderRowProps) => {
	let statusClass = 'bg-red-50 text-danger border-danger'
	let statusLabel = 'Cancelado'
	if (order.status === 'pending') {
		statusClass = 'bg-signal-wash text-signal border-signal'
		statusLabel = 'Pendiente'
	} else if (order.status === 'completed') {
		statusClass = 'bg-green-50 text-success border-success'
		statusLabel = 'Entregado'
	}

	return (
		<>
			<tr
				className="border-b border-line"
				data-testid={`order-row-${order.id.slice(0, 8)}`}
			>
				<td className="px-3 py-3 align-top">
					<button
						onClick={() => onToggle(order.id)}
						className="icon-btn w-7! h-7!"
						aria-label="Detalle"
						data-testid={`toggle-${order.id.slice(0, 8)}`}
					>
						{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
					</button>
				</td>
				<td className="px-5 py-3 align-top">
					<div className="font-medium">{order.customer_name}</div>
					<div className="mono text-[10px] uppercase tracking-[0.14em] text-muted-2">
						{order.id.slice(0, 8)}
					</div>
				</td>
				<td className="px-5 py-3 align-top">
					<span className={`chip ${statusClass}`}>{statusLabel}</span>
				</td>
				<td className="px-5 py-3 align-top text-right mono tabular-nums">
					{formatPrice(Number(order.total))}
				</td>
				<td className="px-5 py-3 align-top text-right mono text-[11px] text-muted">
					{formatDate(order.created_at)}
				</td>
				<td className="px-5 py-3 align-top">
					<div className="flex justify-end items-center gap-1.5">
						{order.status === 'pending' && (
							<>
								<button
									onClick={() => onAction(order.id, 'complete')}
									disabled={busy}
									className="icon-btn text-success"
									aria-label="Marcar como entregado"
									title="Marcar como entregado"
									data-testid={`complete-${order.id.slice(0, 8)}`}
								>
									{busy ? (
										<Loader2 size={14} className="animate-spin" />
									) : (
										<Check size={14} />
									)}
								</button>
								<button
									onClick={() => onAction(order.id, 'cancel')}
									disabled={busy}
									className="icon-btn text-danger"
									aria-label="Cancelar"
									title="Cancelar"
									data-testid={`cancel-${order.id.slice(0, 8)}`}
								>
									<X size={14} />
								</button>
							</>
						)}
					</div>
				</td>
			</tr>
			{open && <OrderDetails order={order} items={items} />}
		</>
	)
}
