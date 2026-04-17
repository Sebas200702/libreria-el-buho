import { useStore } from '@nanostores/react';
import { useState } from 'react';
import {
  cartAtom,
  cartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../lib/store/cart';
import { formatPrice, coverUrl } from '../../lib/utils/format';
import { getBrowserSupabase } from '../../lib/supabase/browser';
import { orderInputSchema } from '../../lib/schemas/order';
import {
  buildWhatsappLink,
  whatsappOrderConfirmation,
  whatsappCartQuickOrder,
} from '../../lib/utils/whatsapp';
import {
  Plus,
  Minus,
  Trash2,
  Check,
  Loader2,
  ShoppingBag,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';

interface Props {
  supabaseUrl: string;
  whatsappNumber: string;
}

export default function CartPage({ supabaseUrl, whatsappNumber }: Props) {
  const items = useStore(cartAtom);
  const total = useStore(cartTotal);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<{
    items: typeof items;
    total: number;
    customerName: string;
  } | null>(null);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg('');
    const payload = {
      ...form,
      items: items.map((i) => ({ book_id: i.book_id, quantity: i.quantity })),
    };
    const parsed = orderInputSchema.safeParse(payload);
    if (!parsed.success) {
      setState('error');
      setErrMsg(parsed.error.issues[0]?.message ?? 'Datos inválidos');
      return;
    }
    setState('submitting');
    const supabase = getBrowserSupabase();
    const { data, error } = await supabase.rpc('create_pending_order', {
      customer_name_input: parsed.data.customer_name,
      customer_email_input: parsed.data.customer_email,
      customer_phone_input: parsed.data.customer_phone ?? '',
      notes_input: parsed.data.notes ?? '',
      items_input: parsed.data.items,
    });
    if (error) {
      setState('error');
      setErrMsg(error.message || 'No se pudo procesar el pedido');
      return;
    }
    const newOrderId = data as string;
    setOrderId(newOrderId);
    setConfirmedSnapshot({
      items: [...items],
      total,
      customerName: parsed.data.customer_name,
    });
    clearCart();
    setState('success');
    // open WhatsApp right away
    const waUrl = buildWhatsappLink(
      whatsappOrderConfirmation({
        orderId: newOrderId,
        items,
        total,
        customerName: parsed.data.customer_name,
      }),
      whatsappNumber,
    );
    window.open(waUrl, '_blank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleQuickWhatsapp() {
    const url = buildWhatsappLink(
      whatsappCartQuickOrder({ items, total }),
      whatsappNumber,
    );
    window.open(url, '_blank');
  }

  if (state === 'success' && orderId && confirmedSnapshot) {
    const waUrl = buildWhatsappLink(
      whatsappOrderConfirmation({
        orderId,
        items: confirmedSnapshot.items,
        total: confirmedSnapshot.total,
        customerName: confirmedSnapshot.customerName,
      }),
      whatsappNumber,
    );
    return (
      <div className="card p-8 md:p-14 fade-up" data-testid="order-success">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[color:var(--color-success)] text-white flex items-center justify-center">
            <Check size={20} strokeWidth={2.4} />
          </div>
          <div className="label text-[color:var(--color-success)]">
            § Pedido registrado
          </div>
        </div>
        <h1 className="text-[32px] md:text-[44px] tracking-tight leading-[1.05] mb-4">
          Listo. Ahora hablemos<br />por WhatsApp.
        </h1>
        <p className="text-[15px] text-[color:var(--color-muted)] max-w-xl leading-[1.6]">
          Tu pedido quedó registrado y los libros reservados. Abrimos WhatsApp con
          el resumen listo para enviar; allí coordinamos pago (transferencia, Nequi
          o Daviplata) y la entrega en Barranquilla o zonas aledañas.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <div className="card p-5 bg-[color:var(--color-paper)] inline-flex flex-col gap-1">
            <div className="label">Referencia</div>
            <div className="mono text-[18px] tabular-nums" data-testid="order-id">
              #{orderId.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <div className="card p-5 bg-[color:var(--color-paper)] inline-flex flex-col gap-1">
            <div className="label">Total</div>
            <div className="mono text-[18px] tabular-nums">
              {formatPrice(confirmedSnapshot.total)}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
            data-testid="wa-send-order"
          >
            <MessageCircle size={14} />
            Abrir WhatsApp con mi pedido
          </a>
          <a href="/catalog" className="btn btn-ghost">
            Seguir mirando libros
          </a>
        </div>

        <div className="mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)] mt-6">
          Si no se abrió WhatsApp, toca el botón de arriba. Guardamos tu referencia por 48 horas.
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card p-12 text-center" data-testid="cart-empty">
        <div className="w-14 h-14 rounded-full border border-[color:var(--color-line-2)] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={20} className="text-[color:var(--color-muted)]" />
        </div>
        <div className="label mb-2">§ Carrito vacío</div>
        <h2 className="text-[28px] tracking-tight mb-2">
          Aún no hay libros aquí.
        </h2>
        <p className="text-[14px] text-[color:var(--color-muted)] mb-6">
          Explora el catálogo y añade los que te interesen.
        </p>
        <a href="/catalog" className="btn btn-primary inline-flex">
          Ir al catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8" data-testid="cart-page">
      {/* Items */}
      <div className="col-span-12 lg:col-span-7">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-[22px] tracking-tight">Tus libros</h2>
          <button
            onClick={() => clearCart()}
            className="mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)] inline-flex items-center gap-1.5"
            data-testid="clear-cart"
          >
            <Trash2 size={12} /> Vaciar
          </button>
        </div>

        <ul className="space-y-3">
          {items.map((item) => {
            const cover = coverUrl(item.cover_image_path, supabaseUrl);
            return (
              <li
                key={item.book_id}
                className="card p-3 flex gap-4 items-center"
                data-testid={`cart-item-${item.slug}`}
              >
                <a
                  href={`/product/${item.slug}`}
                  className="w-[68px] h-[100px] shrink-0 bg-[color:var(--color-paper-3)] rounded-[8px] overflow-hidden"
                >
                  {cover && (
                    <img
                      src={cover}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </a>
                <div className="flex-1 min-w-0">
                  <a href={`/product/${item.slug}`} className="block">
                    <div className="text-[15px] tracking-tight line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-muted)]">
                      {item.author}
                    </div>
                  </a>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center border border-[color:var(--color-line-2)] rounded-[10px] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[color:var(--color-paper-3)]"
                        aria-label="Restar"
                        data-testid={`qty-minus-${item.slug}`}
                      >
                        <Minus size={14} />
                      </button>
                      <div
                        className="mono text-[13px] w-8 text-center tabular-nums"
                        data-testid={`qty-${item.slug}`}
                      >
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[color:var(--color-paper-3)] disabled:opacity-30"
                        aria-label="Sumar"
                        data-testid={`qty-plus-${item.slug}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.book_id)}
                      className="icon-btn text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)]"
                      aria-label="Eliminar"
                      data-testid={`remove-${item.slug}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mono text-[15px] tabular-nums whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 card p-5 flex flex-col gap-2 bg-[color:var(--color-paper)]">
          <div className="label">§ ¿Con prisa?</div>
          <div className="text-[14px] text-[color:var(--color-muted)] leading-[1.55]">
            Puedes saltarte el formulario y escribirnos directo por WhatsApp con tu
            lista. También se registra igual cuando lo confirmemos.
          </div>
          <button
            onClick={handleQuickWhatsapp}
            className="btn btn-ghost justify-center mt-2"
            data-testid="cart-quick-wa"
          >
            <MessageCircle size={14} />
            Enviar carrito por WhatsApp
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="col-span-12 lg:col-span-5">
        <div className="card p-5 md:p-6 sticky top-24">
          <div className="label mb-3">§ Resumen</div>
          <div className="space-y-1.5 text-[13px] text-[color:var(--color-muted)]">
            <div className="flex justify-between">
              <span>Libros</span>
              <span className="mono tabular-nums text-[color:var(--color-ink)]">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="mono tabular-nums">Se acuerda por WhatsApp</span>
            </div>
          </div>
          <div className="hairline my-4"></div>
          <div className="flex justify-between items-baseline">
            <span className="label">Total</span>
            <span className="mono text-[28px] tabular-nums" data-testid="cart-total">
              {formatPrice(total)}
            </span>
          </div>

          <form onSubmit={handleConfirm} className="mt-6 space-y-3" data-testid="checkout-form">
            <div>
              <label className="label block mb-1.5">Nombre</label>
              <input
                className="input"
                required
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Cómo te llamas"
                data-testid="checkout-name"
              />
            </div>
            <div>
              <label className="label block mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                required
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                placeholder="tu@email.com"
                data-testid="checkout-email"
              />
            </div>
            <div>
              <label className="label block mb-1.5">WhatsApp (opcional)</label>
              <input
                className="input"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="300 000 0000"
                data-testid="checkout-phone"
              />
            </div>
            <div>
              <label className="label block mb-1.5">Zona de entrega o notas</label>
              <textarea
                className="input min-h-[72px]"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Barrio en Barranquilla, horarios, preferencias…"
                data-testid="checkout-notes"
              />
            </div>

            {errMsg && (
              <div
                className="flex items-start gap-2 text-[12px] text-[color:var(--color-danger)] mono uppercase tracking-[0.06em]"
                data-testid="checkout-error"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {errMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="btn btn-primary w-full justify-center"
              data-testid="checkout-submit"
            >
              {state === 'submitting' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MessageCircle size={14} />
              )}
              {state === 'submitting'
                ? 'Registrando…'
                : `Confirmar y abrir WhatsApp · ${formatPrice(total)}`}
            </button>
            <div className="mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)] text-center">
              Al confirmar reservamos los libros y abrimos WhatsApp con el resumen.
              El pago se coordina por ese mismo chat.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
