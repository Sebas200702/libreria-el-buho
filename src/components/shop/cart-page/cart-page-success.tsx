import { formatPrice } from '@/lib/utils/format'
import {
    buildWhatsappLink,
    whatsappOrderConfirmation,
} from '@/lib/utils/whatsapp'
import { Check, MessageCircle } from 'lucide-react'
import type { ConfirmedSnapshot } from './types'

interface CartPageSuccessProps {
	orderId: string
	whatsappNumber: string
	confirmedSnapshot: ConfirmedSnapshot
}

export const CartPageSuccess = ({
	orderId,
	whatsappNumber,
	confirmedSnapshot,
}: CartPageSuccessProps) => {
	const waUrl = buildWhatsappLink(
		whatsappOrderConfirmation({
			orderId,
			items: confirmedSnapshot.items,
			total: confirmedSnapshot.total,
			customerName: confirmedSnapshot.customerName,
		}),
		whatsappNumber,
	)

	return (
		<div className="card p-8 md:p-14 fade-up" data-testid="order-success">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center">
					<Check size={20} strokeWidth={2.4} />
				</div>
				<div className="label text-success"> Pedido registrado</div>
			</div>
			<h1 className="text-[32px] md:text-[44px] tracking-tight leading-[1.05] mb-4">
				Listo. Ahora hablemos
				<br />
				por WhatsApp.
			</h1>
			<p className="text-[15px] text-muted max-w-xl leading-[1.6]">
				Tu pedido quedó registrado y los libros reservados. Abrimos WhatsApp con
				el resumen listo para enviar; allí coordinamos pago y la entrega.
			</p>

			<div className="mt-8 flex flex-wrap items-center gap-5">
				<div className="card p-5 bg-paper inline-flex flex-col gap-1">
					<div className="label">Referencia</div>
					<div className="mono text-[18px] tabular-nums" data-testid="order-id">
						#{orderId.slice(0, 8).toUpperCase()}
					</div>
				</div>
				<div className="card p-5 bg-paper inline-flex flex-col gap-1">
					<div className="label">Total</div>
					<div className="mono text-[18px] tabular-nums">
						{formatPrice(confirmedSnapshot.total)}
					</div>
				</div>
			</div>

			<div className="mt-8 flex flex-wrap gap-3">
				<a
					href={waUrl}
					target="_blank"
					rel="noopener"
					className="btn btn-primary"
					data-testid="wa-send-order"
				>
					<MessageCircle size={14} />
					Abrir WhatsApp con mi pedido
				</a>
				<a href="/catalog" className="btn btn-ghost">
					Seguir mirando libros
				</a>
			</div>
		</div>
	)
}
