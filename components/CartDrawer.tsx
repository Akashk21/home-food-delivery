'use client';

import { useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    },
    [closeCart]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('cart-open');
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.classList.remove('cart-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close cart"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <p className="text-gray-400 text-xs mt-1">Add some delicious chicken to get started!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="card p-4 fade-in">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-primary-600 font-medium">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary-600">{formatCurrency(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}