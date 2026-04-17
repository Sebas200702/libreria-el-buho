import { LogOut } from 'lucide-react';
import { getBrowserSupabase } from '../../lib/supabase/browser';

export default function LogoutButton() {
  async function handle() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut({ scope: 'local' });
    // Also clear server cookies by calling sign-out endpoint pattern:
    document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((n) => n.startsWith('sb-'))
      .forEach((n) => {
        document.cookie = `${n}=; Max-Age=0; path=/`;
      });
    window.location.href = '/admin/login';
  }
  return (
    <button
      onClick={handle}
      className="icon-btn"
      aria-label="Salir"
      title="Salir"
      data-testid="logout-btn"
    >
      <LogOut size={14} />
    </button>
  );
}
