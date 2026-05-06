import { useState } from 'react'
import { navigate } from 'astro:transitions/client'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export const useLogoutButton = () => {
	const [loading, setLoading] = useState(false)

	const onLogout = async (): Promise<void> => {
		setLoading(true)
		const supabase = getBrowserSupabase()
		await supabase.auth.signOut({ scope: 'local' })
		document.cookie
			.split(';')
			.map((c) => c.split('=')[0].trim())
			.filter((name) => name.startsWith('sb-'))
			.forEach((name) => {
				document.cookie = `${name}=; Max-Age=0; path=/`
			})
		setLoading(false)
		navigate('/admin/login')
	}

	return { loading, onLogout }
}
