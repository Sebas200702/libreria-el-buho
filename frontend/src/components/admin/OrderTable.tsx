import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Loader2, Mail, Phone, FileText } from 'lucide-react';
import { getBrowserSupabase } from '../../lib/supabase/browser';
import { formatPrice, formatDate } from '../../lib/utils/format';

interface OrderItem {
  id: string;
  book_id: string;
  title_snapshot: string;
  quantity: number;
  unit_price: number;
}
interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  status: 'pending' | 'completed' | 'canceled';
  total: number;
  created_at: string;
  items?: OrderItem[];
}

interface Props {
  initialOrders: Order[];
}

const STATUSES: Array<{ key: Order['status'] | 'all'; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Entregados' },
  { key: 'canceled', label: 'Cancelados' },
];

export default function OrderTable({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [itemsCache, setItemsCache] = useState<Record<string, OrderItem[]>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState('');

  const visible =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  async function toggle(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
    if (!itemsCache[id]) {
      const supabase = getBrowserSupabase();
      const { data } = await supabase
        .from('order_items')
        .select('id, book_id, title_snapshot, quantity, unit_price')
        .eq('order_id', id);
      setItemsCache((s) => ({ ...s, [id]: (data ?? []) as OrderItem[] }));
    }
  }

  async function act(id: string, action: 'complete' | 'cancel') {
    setErr('');
    setBusy((b) => ({ ...b, [id]: true }));
    const supabase = getBrowserSupabase();
    const rpc =
      action === 'complete'
        ? supabase.rpc('complete_order', { order_uuid: id })
        : supabase.rpc('cancel_order', { order_uuid: id });
    const { error } = await rpc;
    setBusy((b) => ({ ...b, [id]: false }));
    if (error) {
      setErr(error.message);
      return;
    }
    setOrders((list) =>
      list.map((o) =>
        o.id === id
          ? { ...o, status: action === 'complete' ? 'completed' : 'canceled' }
          : o,
      ),
    );
  }

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    canceled: orders.filter((o) => o.status === 'canceled').length,
  };

  return (
    <div data-testid="order-table">
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => {
          const active = filter === s.key;
          const n = counts[s.key];
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`chip cursor-pointer ${
                active
                  ? 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)] border-[color:var(--color-ink)]'
                  : ''
              }`}
              data-testid={`filter-${s.key}`}
            >
              {s.label} <span className="opacity-60">· {n}</span>
            </button>
          );
        })}
      </div>

      {err && (
        <div className="mb-3 text-[12px] mono uppercase tracking-[0.06em] text-[color:var(--color-danger)]">
          {err}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)] text-left">
            <tr className="border-b border-[color:var(--color-line)]">
              <th className="px-5 py-2.5 w-[40px]"></th>
              <th className="px-5 py-2.5">Cliente</th>
              <th className="px-5 py-2.5">Estado</th>
              <th className="px-5 py-2.5 text-right">Total</th>
              <th className="px-5 py-2.5 text-right">Fecha</th>
              <th className="px-5 py-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => {
              const open = expanded[o.id];
              return (
                <>
                  <tr
                    key={o.id}
                    className="border-b border-[color:var(--color-line)]"
                    data-testid={`order-row-${o.id.slice(0, 8)}`}
                  >
                    <td className="px-3 py-3 align-top">
                      <button
                        onClick={() => toggle(o.id)}
                        className="icon-btn !w-7 !h-7"
                        aria-label="Detalle"
                        data-testid={`toggle-${o.id.slice(0, 8)}`}
                      >
                        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <div className="font-medium">{o.customer_name}</div>
                      <div className="mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)]">
                        {o.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <span
                        className={`chip ${
                          o.status === 'pending'
                            ? 'bg-[color:var(--color-signal-wash)] text-[color:var(--color-signal)] border-[color:var(--color-signal)]'
                            : o.status === 'completed'
                              ? 'bg-green-50 text-[color:var(--color-success)] border-[color:var(--color-success)]'
                              : 'bg-red-50 text-[color:var(--color-danger)] border-[color:var(--color-danger)]'
                        }`}
                      >
                        {o.status === 'pending'
                          ? 'Pendiente'
                          : o.status === 'completed'
                            ? 'Entregado'
                            : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top text-right mono tabular-nums">
                      {formatPrice(Number(o.total))}
                    </td>
                    <td className="px-5 py-3 align-top text-right mono text-[11px] text-[color:var(--color-muted)]">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-5 py-3 align-top">
                      <div className="flex justify-end items-center gap-1.5">
                        {o.status === 'pending' && (
                          <>
                            <button
                              onClick={() => act(o.id, 'complete')}
                              disabled={busy[o.id]}
                              className="icon-btn text-[color:var(--color-success)]"
                              aria-label="Marcar como entregado"
                              title="Marcar como entregado"
                              data-testid={`complete-${o.id.slice(0, 8)}`}
                            >
                              {busy[o.id] ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button
                              onClick={() => act(o.id, 'cancel')}
                              disabled={busy[o.id]}
                              className="icon-btn text-[color:var(--color-danger)]"
                              aria-label="Cancelar"
                              title="Cancelar"
                              data-testid={`cancel-${o.id.slice(0, 8)}`}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-[color:var(--color-paper)]">
                      <td></td>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-4 space-y-2 text-[13px]">
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="text-[color:var(--color-muted-2)]" />
                              <a href={`mailto:${o.customer_email}`} className="underline">
                                {o.customer_email}
                              </a>
                            </div>
                            {o.customer_phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={13} className="text-[color:var(--color-muted-2)]" />
                                <span>{o.customer_phone}</span>
                              </div>
                            )}
                            {o.notes && (
                              <div className="flex items-start gap-2">
                                <FileText size={13} className="text-[color:var(--color-muted-2)] mt-0.5" />
                                <span className="whitespace-pre-line text-[color:var(--color-muted)]">
                                  {o.notes}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-8">
                            <div className="label mb-2">§ Libros</div>
                            <ul className="divide-y divide-[color:var(--color-line)] border border-[color:var(--color-line)] rounded-[10px] overflow-hidden bg-[color:var(--color-paper-2)]">
                              {(itemsCache[o.id] ?? []).map((it) => (
                                <li
                                  key={it.id}
                                  className="flex items-center justify-between px-4 py-2.5 text-[13px]"
                                >
                                  <div>
                                    <div>{it.title_snapshot}</div>
                                    <div className="mono text-[11px] text-[color:var(--color-muted)]">
                                      ×{it.quantity} · {formatPrice(Number(it.unit_price))}
                                    </div>
                                  </div>
                                  <div className="mono tabular-nums">
                                    {formatPrice(it.quantity * Number(it.unit_price))}
                                  </div>
                                </li>
                              ))}
                              {itemsCache[o.id] && itemsCache[o.id].length === 0 && (
                                <li className="px-4 py-4 mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)]">
                                  Sin detalles disponibles
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)]"
                >
                  Sin pedidos en este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
