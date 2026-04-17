import { useStore } from '@nanostores/react';
import { cartCount } from '../../lib/store/cart';
import { ShoppingBag } from 'lucide-react';

interface Props {
  initialCount?: number;
}

export default function CartButton({ initialCount = 0 }: Props) {
  const count = useStore(cartCount);
  const display = typeof window === 'undefined' ? initialCount : count;
  return (
    <a
      href="/cart"
      className="icon-btn relative"
      aria-label="Carrito"
      data-testid="cart-button"
    >
      <ShoppingBag size={16} strokeWidth={2} />
      {display > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-[4px] rounded-full bg-[color:var(--color-signal)] text-white text-[10px] font-mono flex items-center justify-center"
          data-testid="cart-count"
        >
          {display}
        </span>
      )}
    </a>
  );
}
