export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n);
}

export function coverUrl(
  path: string | null | undefined,
  supabaseUrl: string,
): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${supabaseUrl}/storage/v1/object/public/images/${path}`;
}
