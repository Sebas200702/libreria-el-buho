import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

const url = import.meta.env.PUBLIC_SUPABASE_URL
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

/**
 * Server-side (SSR) Supabase client that reads/writes auth cookies.
 * Use inside Astro middleware, `.astro` pages, and API endpoints.
 */
export function getServerSupabase(context: {
	request: Request
	cookies: AstroCookies
}) {
	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return parseCookieHeader(context.request.headers.get('Cookie') ?? '')
					.filter(
						(c): c is { name: string; value: string } =>
							typeof c.value === 'string',
					)
					.map(({ name, value }) => ({ name, value }))
			},
			setAll(
				cookiesToSet: Array<{
					name: string
					value: string
					options?: Parameters<AstroCookies['set']>[2]
				}>,
			) {
				for (const { name, value, options } of cookiesToSet) {
					context.cookies.set(name, value, options)
				}
			},
		},
	})
}
