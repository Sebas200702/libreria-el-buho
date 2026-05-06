import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

interface Props {
	initialCount?: number
}

export const CartButton = ({ initialCount = 0 }: Props) => {
	const count = useCartStore((state) =>
		state.items.reduce((sum, i) => sum + i.quantity, 0),
	)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const display = isMounted ? count : initialCount
	return (
		<a
			href="/cart"
			className="icon-btn relative"
			aria-label="Carrito"
			data-testid="cart-button"
		>
			<ShoppingBag size={16} strokeWidth={2} />
			{display > 0 && (
				<span
					className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-signal text-white text-[10px] font-mono flex items-center justify-center"
					data-testid="cart-count"
				>
					{display}
				</span>
			)}
		</a>
	)
}
