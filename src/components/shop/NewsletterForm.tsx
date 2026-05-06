import { NewsletterFormView } from '@/components/shop/newsletter-form/newsletter-form-view'
import { useNewsletterForm } from '@/components/shop/newsletter-form/use-newsletter-form'

export const NewsletterForm = () => {
	const { email, status, message, setEmail, onSubmit } = useNewsletterForm()

	return (
		<NewsletterFormView
			email={email}
			status={status}
			message={message}
			onEmailChange={setEmail}
			onSubmit={onSubmit}
		/>
	)
}
