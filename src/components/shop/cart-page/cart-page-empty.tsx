import { ShoppingBag } from 'lucide-react'

export const CartPageEmpty = () => {
	return (
		<div className="card p-12 text-center" data-testid="cart-empty">
			<div className="w-14 h-14 rounded-full border border-line-2 flex items-center justify-center mx-auto mb-4">
				<ShoppingBag size={20} className="text-muted" />
			</div>
			<div className="label mb-2"> Carrito vacío</div>
			<h2 className="text-[28px] tracking-tight mb-2">
				Aún no hay libros aquí.
			</h2>
			<p className="text-[14px] text-muted mb-6">
				Explora el catálogo y añade los que te interesen.
			</p>
			<a href="/catalog" className="btn btn-primary inline-flex">
				Ir al catálogo
			</a>
		</div>
	)
}
