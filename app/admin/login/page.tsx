'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid password');
      }

      // Store token in session
      sessionStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="card">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">🔐</span>
            <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Enter the admin password to continue</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="label">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}