'use client';

import { useState, useCallback } from 'react';
import { useCartStore } from '@/store/cart';
import { MENU_ITEMS, isOperatingDay, getDayName, formatCurrency, COOK_LOCATION } from '@/lib/utils';

export default function Home() {
  const { addItem, openCart, getItemCount } = useCartStore();
  const [, forceUpdate] = useState(0);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const today = new Date();
  const openToday = isOperatingDay(today);
  const dayName = getDayName(today);
  const itemCount = getItemCount();

  const handleAddToCart = useCallback(
    (item: (typeof MENU_ITEMS)[number]) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        emoji: item.emoji,
      });
      setJustAdded(item.id);
      setTimeout(() => setJustAdded(null), 500);
      forceUpdate((n) => n + 1);
    },
    [addItem]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍗</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AIG Chicken</h1>
              <p className="text-xs text-gray-500">{COOK_LOCATION}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/admin'}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </button>
            {itemCount > 0 && (
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Cart ({itemCount})
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Operating Days Banner */}
        {!openToday && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-sm font-medium text-red-700">
                🛑 We're closed today ({dayName}). We operate all days except Tuesday & Thursday.
              </p>
            </div>
          </div>
        )}

        {openToday && (
          <div className="bg-green-50 border-b border-green-200 px-4 py-2">
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-sm font-medium text-green-700">
                ✅ We're open today ({dayName})! Place your order now.
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 sm:py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white" />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                🏡 Home Kitchen Service
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Freshly Home-Cooked Chicken
              </h2>
              <p className="mt-3 text-base text-primary-100 sm:text-lg max-w-xl">
                Order directly from your neighbour in {COOK_LOCATION}. Authentic, hygienic, and made with love.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Ready in 30-45 min
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  Cash / UPI on delivery
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {COOK_LOCATION}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Days Info */}
        <section className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-gray-900">📍 Operating Days:</span>
              <div className="flex flex-wrap gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                  const isClosed = i === 2 || i === 4; // Tue=2, Thu=4
                  const isToday = i === today.getDay();
                  return (
                    <span
                      key={day}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        isClosed
                          ? 'bg-red-50 text-red-600 line-through'
                          : isToday
                          ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-400'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {isClosed ? '✕' : '✓'} {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="px-4 py-8 sm:py-12 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Menu</h2>
            <p className="mt-2 text-gray-600">Freshly prepared with authentic spices. Order now!</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
            {MENU_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="card fade-in group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Placeholder */}
                <div className="flex items-center justify-center h-40 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 mb-4">
                  <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                    {item.emoji}
                  </span>
                </div>

                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-1">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary-600">{formatCurrency(item.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!openToday}
                    className={`btn-primary w-full ${
                      justAdded === item.id ? 'bounce-add' : ''
                    }`}
                  >
                    {justAdded === item.id ? (
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Added!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white border-t border-gray-200 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Choose & Order',
                  desc: 'Select your favorite chicken dish, add quantity, and fill in your delivery details.',
                  icon: '🛒',
                },
                {
                  step: '2',
                  title: 'We Cook Fresh',
                  desc: 'Your order is received instantly. We prepare it fresh with authentic spices.',
                  icon: '👨‍🍳',
                },
                {
                  step: '3',
                  title: 'Delivered to You',
                  desc: 'Get it delivered hot to your doorstep in {COOK_LOCATION}. Pay on delivery!',
                  icon: '🛵',
                },
              ].map((item) => (
                <div key={item.step} className="card text-center fade-in">
                  <span className="text-4xl block mb-3">{item.icon}</span>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 px-4 py-8 text-center">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AIG Chicken · {COOK_LOCATION}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Operating all days except Tuesday & Thursday · Cash / UPI on delivery
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}