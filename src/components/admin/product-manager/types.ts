import type { Book, BookInput } from '@/lib/schemas/book'

export interface ProductManagerProps {
	initialBooks: Book[]
	supabaseUrl: string
}

export interface ProductFormProps {
	initial: Book | null
	supabaseUrl: string
	onClose: () => void
	onSaved: (book: Book) => void
}

export interface ProductFormState {
	data: BookInput
	saving: boolean
	uploading: boolean
	error: string
}
