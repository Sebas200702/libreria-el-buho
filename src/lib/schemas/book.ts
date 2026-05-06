import { z } from 'zod'

export const bookSchema = z.object({
	id: z.string().uuid().optional(),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, 'Use minúsculas, números y guiones'),
	title: z.string().min(1).max(200),
	author: z.string().min(1).max(160),
	description: z.string().max(4000).optional().nullable(),
	genre: z.string().max(80).optional().nullable(),
	category: z.string().max(80).optional().nullable(),
	price: z.coerce.number().nonnegative(),
	release_year: z.coerce.number().int().min(1000).max(9999),
	stock: z.coerce.number().int().nonnegative(),
	reserved_stock: z.coerce.number().int().nonnegative().optional(),
	cover_image_path: z.string().max(500).optional().nullable(),
	published: z.coerce.boolean().default(false),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
})

export type Book = z.infer<typeof bookSchema>

export const bookInputSchema = bookSchema.omit({
	id: true,
	reserved_stock: true,
	created_at: true,
	updated_at: true,
})
export type BookInput = z.infer<typeof bookInputSchema>
