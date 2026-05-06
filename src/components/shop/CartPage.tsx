import { CartPageEmpty } from '@/components/shop/cart-page/cart-page-empty'
import { CartPageItems } from '@/components/shop/cart-page/cart-page-items'
import { CartPageSuccess } from '@/components/shop/cart-page/cart-page-success'
import { CartPageSummaryForm } from '@/components/shop/cart-page/cart-page-summary-form'
import { useCartPage } from '@/components/shop/cart-page/use-cart-page'
import { useCartStore } from '@/lib/store/cart'

interface Props {
	supabaseUrl: string
	whatsappNumber: string
}

export const CartPage = ({ supabaseUrl, whatsappNumber }: Props) => {
	const {
		items,
		total,
		form,
		setForm,
		state,
		orderId,
		errMsg,
		confirmedSnapshot,
		handleConfirm,
		handleQuickWhatsapp,
	} = useCartPage(whatsappNumber)
	const clearCart = useCartStore((state) => state.clearCart)
	const removeFromCart = useCartStore((state) => state.removeFromCart)
	const updateQuantity = useCartStore((state) => state.updateQuantity)

	if (state === 'success' && orderId && confirmedSnapshot) {
		return (
			<CartPageSuccess
				orderId={orderId}
				whatsappNumber={whatsappNumber}
				confirmedSnapshot={confirmedSnapshot}
			/>
		)
	}

	if (items.length === 0) {
		return <CartPageEmpty />
	}

	return (
		<div className="grid grid-cols-12 gap-8" data-testid="cart-page">
			<CartPageItems
				items={items}
				supabaseUrl={supabaseUrl}
				onClearCart={clearCart}
				onUpdateQuantity={updateQuantity}
				onRemoveFromCart={removeFromCart}
				onQuickWhatsapp={handleQuickWhatsapp}
			/>
			<CartPageSummaryForm
				form={form}
				setForm={(nextForm) => setForm(nextForm)}
				total={total}
				state={state}
				errMsg={errMsg}
				onSubmit={handleConfirm}
			/>
		</div>
	)
}
