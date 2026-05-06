import { LoginFormView } from '@/components/admin/login-form/login-form-view'
import type { LoginFormProps } from '@/components/admin/login-form/types'
import { useLoginForm } from '@/components/admin/login-form/use-login-form'

export const LoginForm = ({ next = '/admin' }: LoginFormProps) => {
	const { email, password, loading, error, setEmail, setPassword, onSubmit } =
		useLoginForm(next)

	return (
		<LoginFormView
			email={email}
			password={password}
			loading={loading}
			error={error}
			onEmailChange={setEmail}
			onPasswordChange={setPassword}
			onSubmit={onSubmit}
		/>
	)
}
