'use client';

import { useCartStore } from '@/store/cart';

export default function CartFloatingButton() {
  const { items, toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  if (items.length === 0) return null;

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl active:scale-95"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <span className="font-semibold">View Cart</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-600">
        {itemCount}
      </span>
    </button>
  );
}