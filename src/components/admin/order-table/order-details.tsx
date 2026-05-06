import { formatPrice } from '@/lib/utils/format'
import { FileText, Mail, Phone } from 'lucide-react'
import type { Order, OrderItem } from './types'

interface OrderDetailsProps {
	order: Order
	items: OrderItem[] | undefined
}

export const OrderDetails = ({ order, items }: OrderDetailsProps) => {
	return (
		<tr className="bg-paper">
			<td />
			<td colSpan={5} className="px-5 py-4">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div className="md:col-span-4 space-y-2 text-[13px]">
						<div className="flex items-center gap-2">
							<Mail size={13} className="text-muted-2" />
							<a href={`mailto:${order.customer_email}`} className="underline">
								{order.customer_email}
							</a>
						</div>
						{order.customer_phone && (
							<div className="flex items-center gap-2">
								<Phone size={13} className="text-muted-2" />
								<span>{order.customer_phone}</span>
							</div>
						)}
						{order.notes && (
							<div className="flex items-start gap-2">
								<FileText size={13} className="text-muted-2 mt-0.5" />
								<span className="whitespace-pre-line text-muted">
									{order.notes}
								</span>
							</div>
						)}
					</div>
					<div className="md:col-span-8">
						<div className="label mb-2"> Libros</div>
						<ul className="divide-y divide-line border border-line rounded-[10px] overflow-hidden bg-paper-2">
							{(items ?? []).map((item) => (
								<li
									key={item.id}
									className="flex items-center justify-between px-4 py-2.5 text-[13px]"
								>
									<div>
										<div>{item.title_snapshot}</div>
										<div className="mono text-[11px] text-muted">
											×{item.quantity} · {formatPrice(Number(item.unit_price))}
										</div>
									</div>
									<div className="mono tabular-nums">
										{formatPrice(item.quantity * Number(item.unit_price))}
									</div>
								</li>
							))}
							{items?.length === 0 && (
								<li className="px-4 py-4 mono text-[11px] uppercase tracking-[0.14em] text-muted-2">
									Sin detalles disponibles
								</li>
							)}
						</ul>
					</div>
				</div>
			</td>
		</tr>
	)
}
