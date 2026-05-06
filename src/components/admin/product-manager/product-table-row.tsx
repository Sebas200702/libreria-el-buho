import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import type { Book } from '@/lib/schemas/book'
import { coverUrl, formatPrice } from '@/lib/utils/format'

interface ProductTableRowProps {
	book: Book
	supabaseUrl: string
	onEdit: (book: Book) => void
	onDelete: (id: string) => Promise<void>
	onTogglePublish: (book: Book) => Promise<void>
}

export const ProductTableRow = ({
	book,
	supabaseUrl,
	onEdit,
	onDelete,
	onTogglePublish,
}: ProductTableRowProps) => {
	const cover = coverUrl(book.cover_image_path, supabaseUrl)
	const available = book.stock - (book.reserved_stock ?? 0)
	const bookId = book.id

	return (
		<tr
			key={book.id}
			className="border-b border-line last:border-0"
			data-testid={`book-row-${book.slug}`}
		>
			<td className="px-4 py-3">
				<div className="w-10 h-14 bg-paper-3 rounded-md overflow-hidden">
					{cover && (
						<img src={cover} alt="" className="w-full h-full object-cover" />
					)}
				</div>
			</td>
			<td className="px-4 py-3">
				<div className="font-medium">{book.title}</div>
				<div className="text-[12px] text-muted">
					{book.author} · {book.release_year}
				</div>
			</td>
			<td className="px-4 py-3">
				<span className="chip">{book.genre ?? '—'}</span>
			</td>
			<td className="px-4 py-3 text-right mono tabular-nums">
				{formatPrice(book.price)}
			</td>
			<td className="px-4 py-3 text-right mono tabular-nums">
				{available}/{book.stock}
			</td>
			<td className="px-4 py-3">
				<button
					onClick={() => onTogglePublish(book)}
					className={`chip cursor-pointer ${
						book.published ? 'bg-green-50 text-success border-success' : ''
					}`}
					data-testid={`toggle-publish-${book.slug}`}
				>
					{book.published ? <Eye size={11} /> : <EyeOff size={11} />}
					{book.published ? 'Publicado' : 'Borrador'}
				</button>
			</td>
			<td className="px-4 py-3">
				<div className="flex justify-end gap-1.5">
					<button
						onClick={() => onEdit(book)}
						className="icon-btn"
						aria-label="Editar"
						data-testid={`edit-${book.slug}`}
					>
						<Pencil size={13} />
					</button>
					{bookId && (
						<button
							onClick={() => onDelete(bookId)}
							className="icon-btn text-danger"
							aria-label="Eliminar"
							data-testid={`delete-${book.slug}`}
						>
							<Trash2 size={13} />
						</button>
					)}
				</div>
			</td>
		</tr>
	)
}
