import { Loader2, LogOut } from 'lucide-react'

interface LogoutButtonViewProps {
	loading: boolean
	onLogout: () => Promise<void>
}

export const LogoutButtonView = ({
	loading,
	onLogout,
}: LogoutButtonViewProps) => {
	return (
		<button
			onClick={onLogout}
			disabled={loading}
			className="icon-btn"
			aria-label="Salir"
			title="Salir"
			data-testid="logout-btn"
		>
			{loading ? (
				<Loader2 size={14} className="animate-spin" />
			) : (
				<LogOut size={14} />
			)}
		</button>
	)
}
