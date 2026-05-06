import { STATUSES } from './types'

interface OrderFiltersProps {
	filter: 'all' | 'pending' | 'completed' | 'canceled'
	counts: Record<'all' | 'pending' | 'completed' | 'canceled', number>
	onSelect: (value: 'all' | 'pending' | 'completed' | 'canceled') => void
}

export const OrderFilters = ({
	filter,
	counts,
	onSelect,
}: OrderFiltersProps) => {
	return (
		<div className="flex flex-wrap gap-2 mb-4">
			{STATUSES.map((status) => {
				const active = filter === status.key
				return (
					<button
						key={status.key}
						onClick={() => onSelect(status.key)}
						className={`chip cursor-pointer ${
							active
								? 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)] border-[color:var(--color-ink)]'
								: ''
						}`}
						data-testid={`filter-${status.key}`}
					>
						{status.label}{' '}
						<span className="opacity-60">· {counts[status.key]}</span>
					</button>
				)
			})}
		</div>
	)
}
