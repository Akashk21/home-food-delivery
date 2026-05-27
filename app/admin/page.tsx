'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  preferredTime: string;
  notes: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'delivered'];

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = sessionStorage.getItem('adminToken');
    if (!t) {
      router.push('/admin/login');
      return;
    }
    setToken(t);
    fetchOrders(t);
  }, [router]);

  const fetchOrders = async (t: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to update status');
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading orders...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍗</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Menu
            </Link>
            <button onClick={handleLogout} className="btn-danger text-sm py-1.5 px-3">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending', count: orders.filter((o) => o.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Preparing', count: orders.filter((o) => o.status === 'preparing').length, color: 'bg-purple-50 text-purple-700' },
            { label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length, color: 'bg-green-50 text-green-700' },
          ].map((stat) => (
            <div key={stat.label} className={`card text-center py-4 ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-5xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-500">When customers place orders, they'll show up here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card fade-in">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <p>
                        <span className="text-gray-500">Name:</span>{' '}
                        <span className="font-medium text-gray-900">{order.customerName}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Phone:</span>{' '}
                        <a
                          href={`tel:${order.phone}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {order.phone}
                        </a>
                      </p>
                      <p className="sm:col-span-2">
                        <span className="text-gray-500">Address:</span>{' '}
                        <span className="font-medium text-gray-900">{order.address}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Time:</span>{' '}
                        <span className="font-medium text-gray-900">{order.preferredTime}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Placed:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left font-medium pb-1">Item</th>
                            <th className="text-center font-medium pb-1">Qty</th>
                            <th className="text-right font-medium pb-1">Price</th>
                            <th className="text-right font-medium pb-1">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(order.items) ? order.items : JSON.parse(order.items as any)).map(
                            (item: OrderItem, idx: number) => (
                              <tr key={idx} className="text-gray-700">
                                <td className="py-0.5">{item.name}</td>
                                <td className="text-center py-0.5">{item.quantity}</td>
                                <td className="text-right py-0.5">{formatCurrency(item.price)}</td>
                                <td className="text-right py-0.5 font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-200 text-gray-900 font-bold">
                            <td colSpan={3} className="pt-2 text-right">
                              Total:
                            </td>
                            <td className="pt-2 text-right text-primary-600">
                              {formatCurrency(order.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {order.notes && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">📝 Notes:</span>{' '}
                        <span className="text-gray-700">{order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex sm:flex-col gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={order.status === status}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          order.status === status
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}