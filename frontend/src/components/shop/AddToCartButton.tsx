import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { addToCart } from '../../lib/store/cart';
import type { CartItem } from '../../lib/store/cart';

interface Props {
  item: Omit<CartItem, 'quantity'>;
  variant?: 'primary' | 'ghost' | 'icon';
  label?: string;
}

export default function AddToCartButton({
  item,
  variant = 'primary',
  label = 'Añadir al carrito',
}: Props) {
  const [done, setDone] = useState(false);
  const disabled = item.stock <= 0;

  function handleClick() {
    if (disabled) return;
    addToCart(item, 1);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={label}
        data-testid="add-to-cart-icon"
      >
        {done ? <Check size={16} /> : <Plus size={16} />}
      </button>
    );
  }

  const cls =
    variant === 'ghost'
      ? 'btn btn-ghost w-full justify-center'
      : 'btn btn-primary w-full justify-center';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${cls} disabled:opacity-40 disabled:cursor-not-allowed`}
      data-testid="add-to-cart-btn"
    >
      {done ? (
        <>
          <Check size={16} /> Añadido
        </>
      ) : disabled ? (
        'Sin stock'
      ) : (
        <>
          <Plus size={16} /> {label}
        </>
      )}
    </button>
  );
}
