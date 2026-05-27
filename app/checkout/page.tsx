'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import {
  isOperatingDay,
  formatCurrency,
  TIME_SLOTS,
  COOK_LOCATION,
  getDayName,
} from '@/lib/utils';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    flatNumber: '',
    preferredTime: TIME_SLOTS[0].value,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date();
  const openToday = isOperatingDay(today);
  const dayName = getDayName(today);

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items before checking out.</p>
          <Link href="/" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  if (!openToday) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl block mb-4">😴</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">We're Closed Today</h1>
          <p className="text-gray-600 mb-2">
            Sorry, we don't operate on {dayName}. Please come back on another day!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We're open all days except Tuesday & Thursday.
          </p>
          <Link href="/" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const fullAddress = `${formData.flatNumber ? formData.flatNumber + ', ' : ''}${formData.address}, ${COOK_LOCATION}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          phone: formData.phone,
          address: fullAddress,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
          preferredTime: formData.preferredTime,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Store order ID for success page
      sessionStorage.setItem('lastOrderId', data.orderId);
      sessionStorage.setItem('lastOrderTotal', total.toString());
      sessionStorage.setItem(
        'lastOrderItems',
        JSON.stringify(items)
      );

      clearCart();
      router.push(`/success?orderId=${data.orderId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">Checkout</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 mb-4">🛒 Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="mr-1">{item.emoji}</span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="card space-y-4">
            <h2 className="text-base font-bold text-gray-900">👤 Your Details</h2>

            <div>
              <label htmlFor="customerName" className="label">
                Full Name *
              </label>
              <input
                id="customerName"
                type="text"
                required
                className="input-field"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                className="input-field"
                placeholder="+91 98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="address" className="label">
                Address (within {COOK_LOCATION}) *
              </label>
              <input
                id="address"
                type="text"
                required
                className="input-field"
                placeholder="Street / Tower / Building name"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="flatNumber" className="label">
                Flat / House Number
              </label>
              <input
                id="flatNumber"
                type="text"
                className="input-field"
                placeholder="e.g., Flat 302, Block B"
                value={formData.flatNumber}
                onChange={(e) => handleChange('flatNumber', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="preferredTime" className="label">
                Preferred Delivery Time *
              </label>
              <select
                id="preferredTime"
                required
                className="input-field"
                value={formData.preferredTime}
                onChange={(e) => handleChange('preferredTime', e.target.value)}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="label">
                Special Instructions / Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                className="input-field resize-none"
                placeholder="Any special requests? (spice level, etc.)"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-base py-3"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Placing Order...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Place Order — {formatCurrency(total)}
              </span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}