'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getWhatsAppUrl, formatCurrency, COOK_LOCATION } from '@/lib/utils';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('919XXXXXXXXX');

  useEffect(() => {
    setMounted(true);
    // You can override this with env var
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX';
    setWhatsappNumber(number);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const orderText = `Hello! I've placed an order on AIG Chicken. Order ID: ${orderId?.slice(0, 8) || 'N/A'}. Please confirm.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        {/* Success Animation */}
        <div className="mb-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your order has been received and the cook will start preparing it shortly.
        </p>

        {/* Order ID */}
        <div className="card mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Reference</p>
          <p className="text-lg font-bold text-gray-900 font-mono">
            #{orderId?.slice(0, 8) || 'N/A'}
          </p>
        </div>

        {/* Timeline */}
        <div className="card mb-6 text-left space-y-4">
          <h2 className="text-base font-bold text-gray-900">📋 What Happens Next</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Order Received', desc: 'The cook has been notified via email.', done: true },
              { step: '2', title: 'Confirmation', desc: 'You\'ll get a WhatsApp confirmation within 30 min.', done: false },
              { step: '3', title: 'Prepared Fresh', desc: 'Your food is cooked with love and care.', done: false },
              { step: '4', title: 'Delivered', desc: `Hot food delivered to your doorstep in ${COOK_LOCATION}.`, done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    item.done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {item.done ? '✓' : item.step}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${item.done ? 'text-green-700' : 'text-gray-700'}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="card mb-6 border-green-200 bg-green-50">
          <p className="text-sm font-medium text-gray-700 mb-3">
            💬 Want to confirm faster? Send a WhatsApp message to the cook:
          </p>
          <a
            href={getWhatsAppUrl(whatsappNumber, orderText)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message on WhatsApp
          </a>
        </div>

        <div className="space-y-3">
          <Link href="/" className="btn-secondary w-full">
            Back to Menu
          </Link>
          <Link href="/admin" className="btn-secondary w-full">
            <span className="text-gray-500">🔐 Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}