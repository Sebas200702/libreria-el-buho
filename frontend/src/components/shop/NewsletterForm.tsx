import { useState } from 'react';
import { Check, Mail, Loader2 } from 'lucide-react';
import { getBrowserSupabase } from '../../lib/supabase/browser';
import { newsletterSchema } from '../../lib/schemas/order';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setState('error');
      setMessage(parsed.error.issues[0]?.message ?? 'Email inválido');
      return;
    }
    setState('loading');
    const supabase = getBrowserSupabase();
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: parsed.data.email });
    if (error) {
      const duplicate = /duplicate|unique/i.test(error.message);
      setState(duplicate ? 'done' : 'error');
      setMessage(duplicate ? 'Ya estás en la lista.' : 'No pudimos registrarte. Inténtalo más tarde.');
      return;
    }
    setState('done');
    setMessage('Suscripción confirmada.');
    setEmail('');
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3"
      data-testid="newsletter-form"
    >
      <div className="relative flex-1">
        <Mail
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted-2)]"
        />
        <input
          type="email"
          value={email}
          required
          placeholder="tu@email.com"
          onChange={(e) => setEmail(e.target.value)}
          className="input pl-9"
          aria-label="Email"
          data-testid="newsletter-input"
        />
      </div>
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn btn-primary justify-center disabled:opacity-60"
        data-testid="newsletter-submit"
      >
        {state === 'loading' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : state === 'done' ? (
          <Check size={16} />
        ) : null}
        {state === 'done' ? 'Suscrito' : 'Suscribir'}
      </button>
      {message && (
        <div
          className={`mono text-[11px] uppercase tracking-[0.14em] self-center ${
            state === 'error' ? 'text-[color:var(--color-danger)]' : 'text-[color:var(--color-muted)]'
          }`}
          data-testid="newsletter-message"
        >
          {message}
        </div>
      )}
    </form>
  );
}
