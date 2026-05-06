import { ProductForm } from '@/components/admin/product-manager/product-form'
import { ProductTable } from '@/components/admin/product-manager/product-table'
import type { ProductManagerProps } from '@/components/admin/product-manager/types'
import { useProductManager } from '@/components/admin/product-manager/use-product-manager'

export const ProductManager = ({
	initialBooks,
	supabaseUrl,
}: ProductManagerProps) => {
	const {
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
	} = useProductManager(initialBooks)

	return (
		<div data-testid="product-manager">
			<ProductTable
				books={filtered}
				supabaseUrl={supabaseUrl}
				query={query}
				onQueryChange={setQuery}
				onCreate={openNew}
				onEdit={openEdit}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>
			{formOpen && (
				<ProductForm
					key={editing?.id ?? 'new'}
					initial={editing}
					supabaseUrl={supabaseUrl}
					onClose={closeForm}
					onSaved={onSaved}
				/>
			)}
		</div>
	)
}
