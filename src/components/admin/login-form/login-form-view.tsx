import { AlertCircle, Loader2, Lock } from 'lucide-react'
import type { LoginFormViewProps } from './types'

export const LoginFormView = ({
	email,
	password,
	loading,
	error,
	onEmailChange,
	onPasswordChange,
	onSubmit,
}: LoginFormViewProps) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
			className="space-y-4"
			data-testid="login-form"
		>
			<div>
				<label className="label block mb-1.5" htmlFor="email">
					Email
				</label>
				<input
					id="email"
					type="email"
					required
					className="input"
					value={email}
					onChange={(e) => onEmailChange(e.target.value)}
					placeholder="tu@email.com"
					data-testid="login-email"
				/>
			</div>
			<div>
				<label className="label block mb-1.5" htmlFor="password">
					Contraseña
				</label>
				<input
					id="password"
					type="password"
					required
					className="input"
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					placeholder="••••••••"
					data-testid="login-password"
				/>
			</div>
			{error && (
				<div
					className="flex items-start gap-2 text-[12px] text-danger mono uppercase tracking-[0.06em]"
					data-testid="login-error"
				>
					<AlertCircle size={14} className="mt-0.5 shrink-0" />
					{error}
				</div>
			)}
			<button
				type="submit"
				disabled={loading}
				className="btn btn-primary w-full justify-center"
				data-testid="login-submit"
			>
				{loading ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					<Lock size={14} />
				)}
				Entrar al panel
			</button>
		</form>
	)
}
