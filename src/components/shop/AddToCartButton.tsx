import type { CartItem } from '@/lib/store/cart'
import { useCartStore } from '@/lib/store/cart'
import { Check, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

interface Props {
	item: Omit<CartItem, 'quantity'>
	variant?: 'primary' | 'ghost' | 'icon'
	label?: string
}

export const AddToCartButton = ({
	item,
	variant = 'primary',
	label = 'Añadir al carrito',
}: Props) => {
	const addToCart = useCartStore((state) => state.addToCart)
	const [done, setDone] = useState(false)
	const disabled = item.stock <= 0

	function handleClick() {
		if (disabled) return
		addToCart(item, 1)
		setDone(true)
		setTimeout(() => setDone(false), 1200)
	}

	if (variant === 'icon') {
		return (
			<button
				onClick={handleClick}
				disabled={disabled}
				className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
				aria-label={label}
				data-testid="add-to-cart-icon"
			>
				{done ? <Check size={16} /> : <Plus size={16} />}
			</button>
		)
	}

	const cls =
		variant === 'ghost'
			? 'btn btn-ghost w-full justify-center'
			: 'btn btn-primary w-full justify-center'

	let buttonContent: ReactNode
	if (done) {
		buttonContent = (
			<>
				<Check size={16} /> Añadido
			</>
		)
	} else if (disabled) {
		buttonContent = 'Sin stock'
	} else {
		buttonContent = (
			<>
				<Plus size={16} /> {label}
			</>
		)
	}

	return (
		<button
			onClick={handleClick}
			disabled={disabled}
			className={`${cls} disabled:opacity-40 disabled:cursor-not-allowed`}
			data-testid="add-to-cart-btn"
		>
			{buttonContent}
		</button>
	)
}
