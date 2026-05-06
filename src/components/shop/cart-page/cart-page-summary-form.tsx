import { formatPrice } from '@/lib/utils/format'
import { AlertCircle, Loader2, MessageCircle } from 'lucide-react'
import type { SubmitEvent } from 'react'
import type { CartForm, CheckoutState } from './types'

interface CartPageSummaryFormProps {
	form: CartForm
	setForm: (form: CartForm) => void
	total: number
	state: CheckoutState
	errMsg: string
	onSubmit: (e: SubmitEvent<HTMLFormElement>) => Promise<void>
}

export const CartPageSummaryForm = ({
	form,
	setForm,
	total,
	state,
	errMsg,
	onSubmit,
}: CartPageSummaryFormProps) => {
	return (
		<div className="col-span-12 lg:col-span-5">
			<div className="card p-5 md:p-6 sticky top-24">
				<div className="label mb-3"> Resumen</div>
				<div className="space-y-1.5 text-[13px] text-muted">
					<div className="flex justify-between">
						<span>Libros</span>
						<span className="mono tabular-nums text-ink">
							{formatPrice(total)}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Envío</span>
						<span className="mono tabular-nums">Se acuerda por WhatsApp</span>
					</div>
				</div>
				<div className="hairline my-4" />
				<div className="flex justify-between items-baseline">
					<span className="label">Total</span>
					<span
						className="mono text-[28px] tabular-nums"
						data-testid="cart-total"
					>
						{formatPrice(total)}
					</span>
				</div>

				<form
					onSubmit={onSubmit}
					className="mt-6 space-y-3"
					data-testid="checkout-form"
				>
					<input
						className="input"
						required
						value={form.customer_name}
						onChange={(e) =>
							setForm({ ...form, customer_name: e.target.value })
						}
						placeholder="Cómo te llamas"
						data-testid="checkout-name"
					/>
					<input
						type="email"
						className="input"
						required
						value={form.customer_email}
						onChange={(e) =>
							setForm({ ...form, customer_email: e.target.value })
						}
						placeholder="tu@email.com"
						data-testid="checkout-email"
					/>
					<input
						className="input"
						value={form.customer_phone}
						onChange={(e) =>
							setForm({ ...form, customer_phone: e.target.value })
						}
						placeholder="300 000 0000"
						data-testid="checkout-phone"
					/>
					<textarea
						className="input min-h-18"
						value={form.notes}
						onChange={(e) => setForm({ ...form, notes: e.target.value })}
						placeholder="Barrio en Barranquilla, horarios, preferencias…"
						data-testid="checkout-notes"
					/>

					{errMsg && (
						<div
							className="flex items-start gap-2 text-[12px] text-danger mono uppercase tracking-[0.06em]"
							data-testid="checkout-error"
						>
							<AlertCircle size={14} className="mt-0.5 shrink-0" />
							{errMsg}
						</div>
					)}

					<button
						type="submit"
						disabled={state === 'submitting'}
						className="btn btn-primary w-full justify-center"
						data-testid="checkout-submit"
					>
						{state === 'submitting' ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<MessageCircle size={14} />
						)}
						{state === 'submitting'
							? 'Registrando…'
							: `Confirmar y abrir WhatsApp · ${formatPrice(total)}`}
					</button>
				</form>
			</div>
		</div>
	)
}
