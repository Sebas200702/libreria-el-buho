import { LogoutButtonView } from '@/components/admin/logout-button/logout-button-view'
import { useLogoutButton } from '@/components/admin/logout-button/use-logout-button'

export const LogoutButton = () => {
	const { loading, onLogout } = useLogoutButton()

	return <LogoutButtonView loading={loading} onLogout={onLogout} />
}
