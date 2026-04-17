import { useState } from 'react';
import { Loader2, AlertCircle, Lock } from 'lucide-react';
import { getBrowserSupabase } from '../../lib/supabase/browser';

interface Props {
  next?: string;
}

export default function LoginForm({ next = '/admin' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Force a full reload so SSR middleware picks up the new cookie session.
    window.location.href = next;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label className="label block mb-1.5">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          data-testid="login-email"
        />
      </div>
      <div>
        <label className="label block mb-1.5">Contraseña</label>
        <input
          type="password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          data-testid="login-password"
        />
      </div>
      {error && (
        <div
          className="flex items-start gap-2 text-[12px] text-[color:var(--color-danger)] mono uppercase tracking-[0.06em]"
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
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
        Entrar al panel
      </button>
    </form>
  );
}
