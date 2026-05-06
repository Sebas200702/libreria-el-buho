export type NewsletterStatus = 'idle' | 'loading' | 'done' | 'error'

export interface NewsletterFormViewProps {
	email: string
	status: NewsletterStatus
	message: string
	onEmailChange: (value: string) => void
	onSubmit: () => Promise<void>
}
