import type { BookInput } from '@/lib/schemas/book'

interface ProductFormFieldsProps {
	data: BookInput
	onChange: (next: BookInput) => void
	slugify: (value: string) => string
}

export const ProductFormFields = ({
	data,
	onChange,
	slugify,
}: ProductFormFieldsProps) => {
	return (
		<div className="col-span-12 md:col-span-8 space-y-3">
			<input
				className="input"
				required
				value={data.title}
				onChange={(e) =>
					onChange({
						...data,
						title: e.target.value,
						slug: data.slug || slugify(e.target.value),
					})
				}
				data-testid="title-input"
			/>
			<input
				className="input"
				required
				value={data.author}
				onChange={(e) => onChange({ ...data, author: e.target.value })}
				data-testid="author-input"
			/>
			<input
				className="input mono"
				required
				value={data.slug}
				onChange={(e) => onChange({ ...data, slug: slugify(e.target.value) })}
				data-testid="slug-input"
			/>
			<div className="grid grid-cols-12 gap-3">
				<input
					className="input col-span-6"
					value={data.genre ?? ''}
					onChange={(e) => onChange({ ...data, genre: e.target.value })}
					data-testid="genre-input"
				/>
				<input
					className="input col-span-6"
					value={data.category ?? ''}
					onChange={(e) => onChange({ ...data, category: e.target.value })}
					data-testid="category-input"
				/>
			</div>
			<div className="grid grid-cols-12 gap-3">
				<input
					className="input col-span-4"
					required
					type="number"
					min={1000}
					max={9999}
					value={data.release_year}
					onChange={(e) =>
						onChange({ ...data, release_year: Number(e.target.value) })
					}
					data-testid="year-input"
				/>
				<input
					className="input col-span-4"
					required
					type="number"
					step="0.01"
					min={0}
					value={data.price}
					onChange={(e) => onChange({ ...data, price: Number(e.target.value) })}
					data-testid="price-input"
				/>
				<input
					className="input col-span-4"
					required
					type="number"
					min={0}
					value={data.stock}
					onChange={(e) => onChange({ ...data, stock: Number(e.target.value) })}
					data-testid="stock-input"
				/>
			</div>
			<textarea
				className="input min-h-[120px]"
				value={data.description ?? ''}
				onChange={(e) => onChange({ ...data, description: e.target.value })}
				data-testid="description-input"
			/>
			<label className="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={data.published}
					onChange={(e) => onChange({ ...data, published: e.target.checked })}
					className="accent-[color:var(--color-ink)]"
					data-testid="published-checkbox"
				/>
				<span className="text-[13px]">Publicar en tienda</span>
			</label>
		</div>
	)
}
