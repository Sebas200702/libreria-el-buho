import { OrderFilters } from '@/components/admin/order-table/order-filters'
import { OrderRow } from '@/components/admin/order-table/order-row'
import type { OrderTableProps } from '@/components/admin/order-table/types'
import { useOrderTable } from '@/components/admin/order-table/use-order-table'

export const OrderTable = ({ initialOrders }: OrderTableProps) => {
	const {
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
	} = useOrderTable(initialOrders)

	return (
		<div data-testid="order-table">
			<OrderFilters filter={filter} counts={counts} onSelect={setFilter} />

			{err && (
				<div className="mb-3 text-[12px] mono uppercase tracking-[0.06em] text-danger">
					{err}
				</div>
			)}

			<div className="card">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[640px] text-[13px]">
					<thead className="mono text-[10px] uppercase tracking-[0.14em] text-muted-2 text-left">
						<tr className="border-b border-line">
							<th className="px-5 py-2.5 w-10"></th>
							<th className="px-5 py-2.5">Cliente</th>
							<th className="px-5 py-2.5">Estado</th>
							<th className="px-5 py-2.5 text-right">Total</th>
							<th className="px-5 py-2.5 text-right">Fecha</th>
							<th className="px-5 py-2.5 text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{visible.map((order) => (
							<OrderRow
								key={order.id}
								order={order}
								open={Boolean(expanded[order.id])}
								items={itemsCache[order.id]}
								busy={Boolean(busy[order.id])}
								onToggle={toggle}
								onAction={act}
							/>
						))}
						{visible.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="px-5 py-10 text-center mono text-[11px] uppercase tracking-[0.14em] text-muted"
								>
									Sin pedidos en este filtro.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
						</div>
		</div>
	)
}
