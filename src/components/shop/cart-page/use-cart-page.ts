import type { Dispatch, SubmitEvent, SetStateAction } from 'react'
import { useState } from 'react'
import { orderInputSchema } from '@/lib/schemas/order'
import { useCartStore } from '@/lib/store/cart'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import {
	buildWhatsappLink,
	whatsappCartQuickOrder,
	whatsappOrderConfirmation,
} from '@/lib/utils/whatsapp'
import type { CartForm, CheckoutState, ConfirmedSnapshot } from './types'

interface UseCartPageReturn {
	items: ReturnType<typeof useCartStore.getState>['items']
	total: number
	form: CartForm
	setForm: Dispatch<SetStateAction<CartForm>>
	state: CheckoutState
	orderId: string | null
	errMsg: string
	confirmedSnapshot: ConfirmedSnapshot | null
	handleConfirm: (e: SubmitEvent<HTMLFormElement>) => Promise<void>
	handleQuickWhatsapp: () => void
}

export const useCartPage = (whatsappNumber: string): UseCartPageReturn => {
	const items = useCartStore((state) => state.items)
	const total = useCartStore((state) =>
		state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
	)
	const clearCart = useCartStore((state) => state.clearCart)

	const [form, setForm] = useState<CartForm>({
		customer_name: '',
		customer_email: '',
		customer_phone: '',
		notes: '',
	})
	const [state, setState] = useState<CheckoutState>('idle')
	const [orderId, setOrderId] = useState<string | null>(null)
	const [errMsg, setErrMsg] = useState('')
	const [confirmedSnapshot, setConfirmedSnapshot] =
		useState<ConfirmedSnapshot | null>(null)

	const handleConfirm = async (
		e: SubmitEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault()
		setErrMsg('')
		const payload = {
			...form,
			items: items.map((item) => ({
				book_id: item.book_id,
				quantity: item.quantity,
			})),
		}
		const parsed = orderInputSchema.safeParse(payload)
		if (!parsed.success) {
			setState('error')
			setErrMsg(parsed.error.issues[0]?.message ?? 'Datos inválidos')
			return
		}

		setState('submitting')
		const supabase = getBrowserSupabase()
		const { data, error } = await supabase.rpc('create_pending_order', {
			customer_name_input: parsed.data.customer_name,
			customer_email_input: parsed.data.customer_email,
			customer_phone_input: parsed.data.customer_phone ?? '',
			notes_input: parsed.data.notes ?? '',
			items_input: parsed.data.items,
		})

		if (error || typeof data !== 'string') {
			setState('error')
			setErrMsg(error?.message || 'No se pudo procesar el pedido')
			return
		}

		setOrderId(data)
		setConfirmedSnapshot({
			items: [...items],
			total,
			customerName: parsed.data.customer_name,
		})
		clearCart()
		setState('success')

		const waUrl = buildWhatsappLink(
			whatsappOrderConfirmation({
				orderId: data,
				items,
				total,
				customerName: parsed.data.customer_name,
			}),
			whatsappNumber,
		)
		window.open(waUrl, '_blank')
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleQuickWhatsapp = (): void => {
		const url = buildWhatsappLink(
			whatsappCartQuickOrder({ items, total }),
			whatsappNumber,
		)
		window.open(url, '_blank')
	}

	return {
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
	}
}
