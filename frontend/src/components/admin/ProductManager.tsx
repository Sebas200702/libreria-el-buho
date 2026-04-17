import { useState, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  X,
  Check,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { getBrowserSupabase } from '../../lib/supabase/browser';
import { formatPrice, coverUrl } from '../../lib/utils/format';
import { bookInputSchema, type Book, type BookInput } from '../../lib/schemas/book';

interface Props {
  initialBooks: Book[];
  supabaseUrl: string;
}

const EMPTY: BookInput = {
  slug: '',
  title: '',
  author: '',
  description: '',
  genre: '',
  category: '',
  price: 0,
  release_year: new Date().getFullYear(),
  stock: 0,
  cover_image_path: '',
  published: false,
};

export default function ProductManager({ initialBooks, supabaseUrl }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const filtered = books.filter((b) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.genre ?? '').toLowerCase().includes(q)
    );
  });

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(b: Book) {
    setEditing(b);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este libro? La acción es permanente.')) return;
    const supabase = getBrowserSupabase();
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    setBooks((list) => list.filter((b) => b.id !== id));
  }

  async function handleTogglePublish(b: Book) {
    const supabase = getBrowserSupabase();
    const { error } = await supabase
      .from('books')
      .update({ published: !b.published })
      .eq('id', b.id!);
    if (error) {
      alert(error.message);
      return;
    }
    setBooks((list) =>
      list.map((x) => (x.id === b.id ? { ...x, published: !b.published } : x)),
    );
  }

  function onSaved(saved: Book) {
    setBooks((list) => {
      const existing = list.find((x) => x.id === saved.id);
      if (existing) return list.map((x) => (x.id === saved.id ? saved : x));
      return [saved, ...list];
    });
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div data-testid="product-manager">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted-2)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor o género…"
            className="input pl-9"
            data-testid="products-search"
          />
        </div>
        <button
          onClick={openNew}
          className="btn btn-primary"
          data-testid="new-book-btn"
        >
          <Plus size={14} /> Nuevo libro
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)] text-left">
            <tr className="border-b border-[color:var(--color-line)]">
              <th className="px-4 py-2.5">Portada</th>
              <th className="px-4 py-2.5">Título</th>
              <th className="px-4 py-2.5">Género</th>
              <th className="px-4 py-2.5 text-right">Precio</th>
              <th className="px-4 py-2.5 text-right">Stock</th>
              <th className="px-4 py-2.5">Estado</th>
              <th className="px-4 py-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const cover = coverUrl(b.cover_image_path, supabaseUrl);
              const available = b.stock - (b.reserved_stock ?? 0);
              return (
                <tr
                  key={b.id}
                  className="border-b border-[color:var(--color-line)] last:border-0"
                  data-testid={`book-row-${b.slug}`}
                >
                  <td className="px-4 py-3">
                    <div className="w-[40px] h-[56px] bg-[color:var(--color-paper-3)] rounded-[6px] overflow-hidden">
                      {cover && (
                        <img
                          src={cover}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-[12px] text-[color:var(--color-muted)]">
                      {b.author} · {b.release_year}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="chip">{b.genre ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right mono tabular-nums">
                    {formatPrice(b.price)}
                  </td>
                  <td className="px-4 py-3 text-right mono tabular-nums">
                    {available}/{b.stock}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(b)}
                      className={`chip cursor-pointer ${
                        b.published
                          ? 'bg-green-50 text-[color:var(--color-success)] border-[color:var(--color-success)]'
                          : ''
                      }`}
                      data-testid={`toggle-publish-${b.slug}`}
                    >
                      {b.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {b.published ? 'Publicado' : 'Borrador'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(b)}
                        className="icon-btn"
                        aria-label="Editar"
                        data-testid={`edit-${b.slug}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id!)}
                        className="icon-btn text-[color:var(--color-danger)]"
                        aria-label="Eliminar"
                        data-testid={`delete-${b.slug}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted)]"
                >
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <ProductForm
          key={editing?.id ?? 'new'}
          initial={editing}
          supabaseUrl={supabaseUrl}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function ProductForm({
  initial,
  supabaseUrl,
  onClose,
  onSaved,
}: {
  initial: Book | null;
  supabaseUrl: string;
  onClose: () => void;
  onSaved: (b: Book) => void;
}) {
  const isEdit = !!initial;
  const [data, setData] = useState<BookInput>({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    author: initial?.author ?? '',
    description: initial?.description ?? '',
    genre: initial?.genre ?? '',
    category: initial?.category ?? '',
    price: initial?.price ?? 0,
    release_year: initial?.release_year ?? new Date().getFullYear(),
    stock: initial?.stock ?? 0,
    cover_image_path: initial?.cover_image_path ?? '',
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError('');
    try {
      const supabase = getBrowserSupabase();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      setData((d) => ({ ...d, cover_image_path: path }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = bookInputSchema.safeParse({
      ...data,
      description: data.description ?? null,
      genre: data.genre ?? null,
      category: data.category ?? null,
      cover_image_path: data.cover_image_path ?? null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos inválidos');
      return;
    }
    setSaving(true);
    const supabase = getBrowserSupabase();
    const payload = {
      ...parsed.data,
      description: parsed.data.description || null,
      genre: parsed.data.genre || null,
      category: parsed.data.category || null,
      cover_image_path: parsed.data.cover_image_path || null,
    };
    let saved;
    if (isEdit && initial?.id) {
      const { data: updated, error: upErr } = await supabase
        .from('books')
        .update(payload)
        .eq('id', initial.id)
        .select('*')
        .single();
      saved = updated;
      if (upErr) setError(upErr.message);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('books')
        .insert(payload)
        .select('*')
        .single();
      saved = inserted;
      if (insErr) setError(insErr.message);
    }
    setSaving(false);
    if (saved) onSaved(saved as Book);
  }

  const cover = coverUrl(data.cover_image_path, supabaseUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-[color:var(--color-ink)]/40 backdrop-blur flex items-start justify-center p-4 md:p-8 overflow-auto"
      data-testid="product-form-modal"
    >
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-3xl p-6 md:p-8 fade-up"
        style={{ animationDuration: '220ms' }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="label">§ {isEdit ? 'Editar' : 'Nuevo'}</div>
            <h2 className="text-[28px] tracking-tight mt-1">
              {isEdit ? data.title : 'Nuevo libro'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Cerrar"
            data-testid="close-form"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Cover */}
          <div className="col-span-12 md:col-span-4">
            <div className="label mb-2">Portada</div>
            <div className="aspect-[2/3] bg-[color:var(--color-paper-3)] rounded-[10px] overflow-hidden border border-[color:var(--color-line-2)] relative">
              {cover ? (
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-2)]">
                  sin portada
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
              data-testid="cover-input"
            />
            <button
              type="button"
              className="btn btn-ghost w-full justify-center mt-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              data-testid="upload-cover"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Subiendo…' : 'Subir portada'}
            </button>
            <input
              className="input mt-2"
              placeholder="o pega una URL pública"
              value={data.cover_image_path ?? ''}
              onChange={(e) =>
                setData((d) => ({ ...d, cover_image_path: e.target.value }))
              }
              data-testid="cover-url-input"
            />
          </div>

          {/* Fields */}
          <div className="col-span-12 md:col-span-8 space-y-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <div className="label mb-1.5">Título</div>
                <input
                  required
                  className="input"
                  value={data.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setData((d) => ({
                      ...d,
                      title,
                      slug: d.slug || slugify(title),
                    }));
                  }}
                  data-testid="title-input"
                />
              </div>
              <div className="col-span-4">
                <div className="label mb-1.5">Año</div>
                <input
                  required
                  type="number"
                  min={1000}
                  max={9999}
                  className="input"
                  value={data.release_year}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      release_year: Number(e.target.value),
                    }))
                  }
                  data-testid="year-input"
                />
              </div>
            </div>
            <div>
              <div className="label mb-1.5">Autor</div>
              <input
                required
                className="input"
                value={data.author}
                onChange={(e) => setData((d) => ({ ...d, author: e.target.value }))}
                data-testid="author-input"
              />
            </div>
            <div>
              <div className="label mb-1.5">Slug</div>
              <input
                required
                className="input mono"
                value={data.slug}
                onChange={(e) =>
                  setData((d) => ({ ...d, slug: slugify(e.target.value) }))
                }
                data-testid="slug-input"
              />
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <div className="label mb-1.5">Género</div>
                <input
                  className="input"
                  value={data.genre ?? ''}
                  onChange={(e) => setData((d) => ({ ...d, genre: e.target.value }))}
                  data-testid="genre-input"
                />
              </div>
              <div className="col-span-6">
                <div className="label mb-1.5">Categoría</div>
                <input
                  className="input"
                  value={data.category ?? ''}
                  onChange={(e) =>
                    setData((d) => ({ ...d, category: e.target.value }))
                  }
                  data-testid="category-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <div className="label mb-1.5">Precio (€)</div>
                <input
                  required
                  type="number"
                  step="0.01"
                  min={0}
                  className="input"
                  value={data.price}
                  onChange={(e) =>
                    setData((d) => ({ ...d, price: Number(e.target.value) }))
                  }
                  data-testid="price-input"
                />
              </div>
              <div className="col-span-6">
                <div className="label mb-1.5">Stock</div>
                <input
                  required
                  type="number"
                  min={0}
                  className="input"
                  value={data.stock}
                  onChange={(e) =>
                    setData((d) => ({ ...d, stock: Number(e.target.value) }))
                  }
                  data-testid="stock-input"
                />
              </div>
            </div>
            <div>
              <div className="label mb-1.5">Sinopsis</div>
              <textarea
                className="input min-h-[120px]"
                value={data.description ?? ''}
                onChange={(e) =>
                  setData((d) => ({ ...d, description: e.target.value }))
                }
                data-testid="description-input"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.published}
                onChange={(e) => setData((d) => ({ ...d, published: e.target.checked }))}
                className="accent-[color:var(--color-ink)]"
                data-testid="published-checkbox"
              />
              <span className="text-[13px]">Publicar en tienda</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-[12px] mono uppercase tracking-[0.06em] text-[color:var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6 border-t border-[color:var(--color-line)] pt-5">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            data-testid="save-book"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isEdit ? 'Guardar cambios' : 'Crear libro'}
          </button>
        </div>
      </form>
    </div>
  );
}
