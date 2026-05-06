import { Loader2, Upload } from 'lucide-react'
import { coverUrl } from '@/lib/utils/format'
import type { BookInput } from '@/lib/schemas/book'

interface ProductFormCoverProps {
	data: BookInput
	supabaseUrl: string
	uploading: boolean
	fileRef: React.RefObject<HTMLInputElement | null>
	onUpload: (file: File) => Promise<void>
	onCoverPathChange: (value: string) => void
}

export const ProductFormCover = ({
	data,
	supabaseUrl,
	uploading,
	fileRef,
	onUpload,
	onCoverPathChange,
}: ProductFormCoverProps) => {
	const cover = coverUrl(data.cover_image_path, supabaseUrl)

	return (
		<div className="col-span-12 md:col-span-4">
			<div className="label mb-2">Portada</div>
			<div className="aspect-2/3 bg-paper-3 rounded-[10px] overflow-hidden border border-line-2 relative">
				{cover ? (
					<img src={cover} alt="" className="w-full h-full object-cover" />
				) : (
					<div className="absolute inset-0 flex items-center justify-center mono text-[10px] uppercase tracking-[0.14em] text-muted-2">
						sin portada
					</div>
				)}
			</div>
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) onUpload(file)
				}}
				data-testid="cover-input"
			/>
			<button
				type="button"
				className="btn btn-ghost w-full justify-center mt-2"
				onClick={() => fileRef.current?.click()}
				disabled={uploading}
				data-testid="upload-cover"
			>
				{uploading ? (
					<Loader2 size={14} className="animate-spin" />
				) : (
					<Upload size={14} />
				)}
				{uploading ? 'Subiendo…' : 'Subir portada'}
			</button>
			<input
				className="input mt-2"
				placeholder="o pega una URL pública"
				value={data.cover_image_path ?? ''}
				onChange={(e) => onCoverPathChange(e.target.value)}
				data-testid="cover-url-input"
			/>
		</div>
	)
}
