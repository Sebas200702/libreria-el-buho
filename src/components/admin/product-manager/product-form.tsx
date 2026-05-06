import { ProductFormCover } from '@/components/admin/product-manager/product-form-cover'
import { ProductFormFields } from '@/components/admin/product-manager/product-form-fields'
import type { ProductFormProps } from '@/components/admin/product-manager/types'
import { useProductForm } from '@/components/admin/product-manager/use-product-form'
import { Check, Loader2, X } from 'lucide-react'

export const ProductForm = ({
	initial,
	supabaseUrl,
	onClose,
	onSaved,
}: ProductFormProps) => {
	const {
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
	} = useProductForm(initial, onSaved)

	return (
		<div
			className="fixed inset-0 z-50 bg-ink/40 backdrop-blur flex items-start justify-center p-4 md:p-8 overflow-auto"
			data-testid="product-form-modal"
		>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleSubmit()
				}}
				className="card w-full max-w-3xl p-6 md:p-8 fade-up"
				style={{ animationDuration: '220ms' }}
			>
				<div className="flex items-start justify-between mb-6">
					<div>
						<div className="label"> {isEdit ? 'Editar' : 'Nuevo'}</div>
						<h2 className="text-[28px] tracking-tight mt-1">
							{isEdit ? data.title : 'Nuevo libro'}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="icon-btn"
						aria-label="Cerrar"
						data-testid="close-form"
					>
						<X size={16} />
					</button>
				</div>

				<div className="grid grid-cols-12 gap-5">
					<ProductFormCover
						data={data}
						supabaseUrl={supabaseUrl}
						uploading={uploading}
						fileRef={fileRef}
						onUpload={handleUpload}
						onCoverPathChange={(value) =>
							setData((state) => ({ ...state, cover_image_path: value }))
						}
					/>
					<ProductFormFields data={data} onChange={setData} slugify={slugify} />
				</div>

				{error && (
					<div className="mt-4 text-[12px] mono uppercase tracking-[0.06em] text-danger">
						{error}
					</div>
				)}
				<div className="flex justify-end gap-2 mt-6 border-t border-line pt-5">
					<button type="button" onClick={onClose} className="btn btn-ghost">
						Cancelar
					</button>
					<button
						type="submit"
						disabled={saving}
						className="btn btn-primary"
						data-testid="save-book"
					>
						{saving ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<Check size={14} />
						)}
						{isEdit ? 'Guardar cambios' : 'Crear libro'}
					</button>
				</div>
			</form>
		</div>
	)
}
