import { useMemo, useState } from 'react'
import type { Book } from '@/lib/schemas/book'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export const useProductManager = (initialBooks: Book[]) => {
	const [books, setBooks] = useState<Book[]>(initialBooks)
	const [query, setQuery] = useState('')
	const [formOpen, setFormOpen] = useState(false)
	const [editing, setEditing] = useState<Book | null>(null)

	const filtered = useMemo(() => {
		if (!query.trim()) return books
		const normalized = query.toLowerCase()
		return books.filter(
			(book) =>
				book.title.toLowerCase().includes(normalized) ||
				book.author.toLowerCase().includes(normalized) ||
				(book.genre ?? '').toLowerCase().includes(normalized),
		)
	}, [books, query])

	const openNew = (): void => {
		setEditing(null)
		setFormOpen(true)
	}

	const openEdit = (book: Book): void => {
		setEditing(book)
		setFormOpen(true)
	}

	const closeForm = (): void => {
		setFormOpen(false)
		setEditing(null)
	}

	const handleDelete = async (id: string): Promise<void> => {
		if (!confirm('¿Eliminar este libro? La acción es permanente.')) return
		const supabase = getBrowserSupabase()
		const { error } = await supabase.from('books').delete().eq('id', id)
		if (error) {
			alert(error.message)
			return
		}
		setBooks((state) => state.filter((book) => book.id !== id))
	}

	const handleTogglePublish = async (book: Book): Promise<void> => {
		const supabase = getBrowserSupabase()
		const { error } = await supabase
			.from('books')
			.update({ published: !book.published })
			.eq('id', book.id!)
		if (error) {
			alert(error.message)
			return
		}
		setBooks((state) =>
			state.map((item) =>
				item.id === book.id ? { ...item, published: !book.published } : item,
			),
		)
	}

	const onSaved = (saved: Book): void => {
		setBooks((state) => {
			const existing = state.find((book) => book.id === saved.id)
			if (existing)
				return state.map((book) => (book.id === saved.id ? saved : book))
			return [saved, ...state]
		})
		closeForm()
	}

	return {
		query,
		setQuery,
		formOpen,
		editing,
		filtered,
		openNew,
		openEdit,
		closeForm,
		handleDelete,
		handleTogglePublish,
		onSaved,
	}
}
