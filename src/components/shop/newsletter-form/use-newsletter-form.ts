import { useState } from 'react'
import { newsletterSchema } from '@/lib/schemas/order'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import type { NewsletterStatus } from './types'

export const useNewsletterForm = () => {
	const [email, setEmail] = useState('')
	const [status, setStatus] = useState<NewsletterStatus>('idle')
	const [message, setMessage] = useState('')

	const onSubmit = async (): Promise<void> => {
		setMessage('')
		const parsed = newsletterSchema.safeParse({ email })
		if (!parsed.success) {
			setStatus('error')
			setMessage(parsed.error.issues[0]?.message ?? 'Email invalido')
			return
		}

		setStatus('loading')
		const supabase = getBrowserSupabase()
		const { error } = await supabase
			.from('subscribers')
			.insert({ email: parsed.data.email })

		if (error) {
			const duplicate = /duplicate|unique/i.test(error.message)
			setStatus(duplicate ? 'done' : 'error')
			setMessage(
				duplicate
					? 'Ya estas en la lista.'
					: 'No pudimos registrarte. Intentalo mas tarde.',
			)
			return
		}

		setStatus('done')
		setMessage('Suscripcion confirmada.')
		setEmail('')
	}

	return {
		email,
		status,
		message,
		setEmail,
		onSubmit,
	}
}
