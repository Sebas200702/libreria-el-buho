import { Search } from 'lucide-react'
import type { Book } from '@/lib/schemas/book'
import { ProductTableRow } from './product-table-row'

interface ProductTableProps {
	books: Book[]
	supabaseUrl: string
	query: string
	onQueryChange: (value: string) => void
	onCreate: () => void
	onEdit: (book: Book) => void
	onDelete: (id: string) => Promise<void>
	onTogglePublish: (book: Book) => Promise<void>
}

export const ProductTable = ({
	books,
	supabaseUrl,
	query,
	onQueryChange,
	onCreate,
	onEdit,
	onDelete,
	onTogglePublish,
}: ProductTableProps) => {
	return (
		<>
			<div className="flex flex-wrap items-center gap-3 mb-4">
				<div className="relative flex-1 min-w-60">
					<Search
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2"
					/>
					<input
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						placeholder="Buscar por título, autor o género…"
						className="input pl-9"
						data-testid="products-search"
					/>
				</div>
				<button
					onClick={onCreate}
					className="btn btn-primary"
					data-testid="new-book-btn"
				>
					Nuevo libro
				</button>
			</div>

				<div className="card">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[720px] text-[13px]">
					<thead className="mono text-[10px] uppercase tracking-[0.14em] text-muted-2 text-left">
						<tr className="border-b border-line">
							<th className="px-4 py-2.5">Portada</th>
							<th className="px-4 py-2.5">Título</th>
							<th className="px-4 py-2.5">Género</th>
							<th className="px-4 py-2.5 text-right">Precio</th>
							<th className="px-4 py-2.5 text-right">Stock</th>
							<th className="px-4 py-2.5">Estado</th>
							<th className="px-4 py-2.5 text-right">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{books.map((book) => (
							<ProductTableRow
								key={book.id}
								book={book}
								supabaseUrl={supabaseUrl}
								onEdit={onEdit}
								onDelete={onDelete}
								onTogglePublish={onTogglePublish}
							/>
						))}
						{books.length === 0 && (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-10 text-center mono text-[11px] uppercase tracking-[0.14em] text-muted"
								>
									Sin resultados
								</td>
							</tr>
						)}
					</tbody>
				</table>
					</div>
			</div>
		</>
	)
}
