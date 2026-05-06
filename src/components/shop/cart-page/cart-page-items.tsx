import type { CartItem } from '@/lib/store/cart'
import { coverUrl, formatPrice } from '@/lib/utils/format'
import { MessageCircle, Minus, Plus, Trash2 } from 'lucide-react'

interface CartPageItemsProps {
	items: CartItem[]
	supabaseUrl: string
	onClearCart: () => void
	onUpdateQuantity: (book_id: string, qty: number) => void
	onRemoveFromCart: (book_id: string) => void
	onQuickWhatsapp: () => void
}

export const CartPageItems = ({
	items,
	supabaseUrl,
	onClearCart,
	onUpdateQuantity,
	onRemoveFromCart,
	onQuickWhatsapp,
}: CartPageItemsProps) => {
	return (
		<div className="col-span-12 lg:col-span-7">
			<div className="flex items-end justify-between mb-4">
				<h2 className="text-[22px] tracking-tight">Tus libros</h2>
				<button
					onClick={onClearCart}
					className="mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-danger inline-flex items-center gap-1.5"
					data-testid="clear-cart"
				>
					<Trash2 size={12} /> Vaciar
				</button>
			</div>

			<ul className="space-y-3">
				{items.map((item) => {
					const cover = coverUrl(item.cover_image_path, supabaseUrl)
					return (
						<li
							key={item.book_id}
							className="card p-3 flex gap-4 items-center"
							data-testid={`cart-item-${item.slug}`}
						>
							<a
								href={`/product/${item.slug}`}
								className="w-17 h-25 shrink-0 bg-paper-3 rounded-lg overflow-hidden"
							>
								{cover && (
									<img
										src={cover}
										alt={item.title}
										className="w-full h-full object-cover"
									/>
								)}
							</a>
							<div className="flex-1 min-w-0">
								<a href={`/product/${item.slug}`} className="block">
									<div className="text-[15px] tracking-tight line-clamp-1">
										{item.title}
									</div>
									<div className="text-[12px] text-muted">{item.author}</div>
								</a>
								<div className="mt-2 flex items-center gap-3">
									<div className="flex items-center border border-line-2 rounded-[10px] overflow-hidden">
										<button
											onClick={() =>
												onUpdateQuantity(item.book_id, item.quantity - 1)
											}
											className="w-8 h-8 flex items-center justify-center hover:bg-paper-3"
											aria-label="Restar"
											data-testid={`qty-minus-${item.slug}`}
										>
											<Minus size={14} />
										</button>
										<div
											className="mono text-[13px] w-8 text-center tabular-nums"
											data-testid={`qty-${item.slug}`}
										>
											{item.quantity}
										</div>
										<button
											onClick={() =>
												onUpdateQuantity(item.book_id, item.quantity + 1)
											}
											disabled={item.quantity >= item.stock}
											className="w-8 h-8 flex items-center justify-center hover:bg-paper-3 disabled:opacity-30"
											aria-label="Sumar"
											data-testid={`qty-plus-${item.slug}`}
										>
											<Plus size={14} />
										</button>
									</div>
									<button
										onClick={() => onRemoveFromCart(item.book_id)}
										className="icon-btn text-muted hover:text-danger"
										aria-label="Eliminar"
										data-testid={`remove-${item.slug}`}
									>
										<Trash2 size={14} />
									</button>
								</div>
							</div>
							<div className="mono text-[15px] tabular-nums whitespace-nowrap">
								{formatPrice(item.price * item.quantity)}
							</div>
						</li>
					)
				})}
			</ul>

			<div className="mt-6 card p-5 flex flex-col gap-2 bg-paper">
				<div className="label"> ¿Con prisa?</div>
				<div className="text-[14px] text-muted leading-[1.55]">
					Puedes saltarte el formulario y escribirnos directo por WhatsApp con
					tu lista. También se registra igual cuando lo confirmemos.
				</div>
				<button
					onClick={onQuickWhatsapp}
					className="btn btn-ghost justify-center mt-2"
					data-testid="cart-quick-wa"
				>
					<MessageCircle size={14} />
					Enviar carrito por WhatsApp
				</button>
			</div>
		</div>
	)
}
