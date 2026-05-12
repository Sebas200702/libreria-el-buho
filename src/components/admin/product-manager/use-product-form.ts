import { useRef, useState } from 'react'
import { bookInputSchema, type Book, type BookInput } from '@/lib/schemas/book'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export const useProductForm = (
	initial: Book | null,
	onSaved: (book: Book) => void,
) => {
	const isEdit = Boolean(initial)
	const [data, setData] = useState<BookInput>({
		slug: initial?.slug ?? '',
		title: initial?.title ?? '',
		author: initial?.author ?? '',
		description: initial?.description ?? '',
		genre: initial?.genre ?? '',
		category: initial?.category ?? '',
		price: initial?.price ?? 0,
		release_year: initial?.release_year ?? new Date().getFullYear(),
		stock: initial?.stock ?? 0,
		cover_image_path: initial?.cover_image_path ?? '',
		published: initial?.published ?? false,
	})
	const [saving, setSaving] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState('')
	const fileRef = useRef<HTMLInputElement>(null)

	const slugify = (value: string): string =>
		value
			.toLowerCase()
			.normalize('NFD')
			.replaceAll(/\p{Diacritic}/gu, '')
			.replaceAll(/[^a-z0-9\s-]/g, '')
			.trim()
			.replaceAll(/\s+/g, '-')
			.replaceAll(/-+/g, '-')

	const handleUpload = async (file: File): Promise<void> => {
		setUploading(true)
		setError('')
		try {
			const supabase = getBrowserSupabase()
			const ext = file.name.split('.').pop() ?? 'jpg'
			const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
			const { error: uploadError } = await supabase.storage
				.from('images')
				.upload(path, file, { contentType: file.type, upsert: false })
			if (uploadError) throw uploadError
			setData((state) => ({ ...state, cover_image_path: path }))
		} catch (error_) {
			setError(
				error_ instanceof Error ? error_.message : 'Error al subir la portada',
			)
		} finally {
			setUploading(false)
		}
	}

	const handleSubmit = async (): Promise<void> => {
		setError('')
		const parsed = bookInputSchema.safeParse({
			...data,
			description: data.description ?? null,
			genre: data.genre ?? null,
			category: data.category ?? null,
			cover_image_path: data.cover_image_path ?? null,
		})
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? 'Datos inválidos')
			return
		}
		setSaving(true)
		const supabase = getBrowserSupabase()
		const payload = {
			...parsed.data,
			description: parsed.data.description || null,
			genre: parsed.data.genre || null,
			category: parsed.data.category || null,
			cover_image_path: parsed.data.cover_image_path || null,
		}
		const result =
			isEdit && initial?.id
				? await supabase
						.from('books')
						.update(payload)
						.eq('id', initial.id)
						.select('*')
						.maybeSingle()
				: await supabase.from('books').insert(payload).select('*').maybeSingle()
		setSaving(false)
		if (result.error) {
			setError(result.error.message)
			return
		}
		if (!result.data) {
			setError('No se pudo guardar el libro. Verifica las políticas RLS.')
			return
		}
		onSaved(result.data as Book)
	}

	return {
		isEdit,
		data,
		setData,
		saving,
		uploading,
		error,
		fileRef,
		slugify,
		handleUpload,
		handleSubmit,
	}
}
