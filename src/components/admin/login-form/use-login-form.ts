import { useState } from 'react'
import { navigate } from 'astro:transitions/client'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export const useLoginForm = (next: string) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (): Promise<void> => {
		setError('')
		setLoading(true)
		const supabase = getBrowserSupabase()
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		setLoading(false)
		if (signInError) {
			setError(signInError.message)
			return
		}

		navigate(next)
	}

	return {
		email,
		password,
		loading,
		error,
		setEmail,
		setPassword,
		onSubmit,
	}
}
