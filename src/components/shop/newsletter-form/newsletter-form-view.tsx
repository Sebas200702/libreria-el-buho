import { Check, Loader2, Mail } from 'lucide-react'
import type { NewsletterFormViewProps } from './types'

export const NewsletterFormView = ({
	email,
	status,
	message,
	onEmailChange,
	onSubmit,
}: NewsletterFormViewProps) => {
	let submitIcon: React.ReactNode = null
	if (status === 'loading') {
		submitIcon = <Loader2 size={16} className="animate-spin" />
	} else if (status === 'done') {
		submitIcon = <Check size={16} />
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
			className="flex flex-col sm:flex-row gap-3"
			data-testid="newsletter-form"
		>
			<div className="relative flex-1">
				<Mail
					size={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-2"
				/>
				<input
					type="email"
					value={email}
					required
					placeholder="tu@email.com"
					onChange={(e) => onEmailChange(e.target.value)}
					className="input pl-9"
					aria-label="Email"
					data-testid="newsletter-input"
				/>
			</div>
			<button
				type="submit"
				disabled={status === 'loading'}
				className="btn btn-primary justify-center disabled:opacity-60"
				data-testid="newsletter-submit"
			>
				{submitIcon}
				{status === 'done' ? 'Suscrito' : 'Suscribir'}
			</button>
			{message && (
				<div
					className={`mono text-[11px] uppercase tracking-[0.14em] self-center ${
						status === 'error' ? 'text-danger' : 'text-muted'
					}`}
					data-testid="newsletter-message"
				>
					{message}
				</div>
			)}
		</form>
	)
}
