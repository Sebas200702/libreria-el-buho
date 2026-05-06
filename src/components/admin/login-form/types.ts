export interface LoginFormProps {
	next?: string
}

export interface LoginFormViewProps {
	email: string
	password: string
	loading: boolean
	error: string
	onEmailChange: (value: string) => void
	onPasswordChange: (value: string) => void
	onSubmit: () => Promise<void>
}
