"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid code');
        setCode('');
      }
    } catch (err) {
      setError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="noise-overlay" />
      
      <div className="relative z-10 w-full max-w-sm border border-border-primary bg-surface p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold uppercase tracking-[-0.04em] text-outline leading-none mb-2">
            SECURE
            <br />
            LOGIN
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-text-muted uppercase tracking-wider">
            Enter Authenticator Code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              autoComplete="one-time-code"
              className="w-full bg-background border border-border-primary p-4 text-center text-[24px] tracking-[0.5em] font-[family-name:var(--font-mono)] text-primary placeholder:text-border-primary focus:border-primary-fixed focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-[12px] text-center font-[family-name:var(--font-mono)] uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-primary-fixed text-background py-4 font-[family-name:var(--font-mono)] text-[14px] font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'VERIFYING...' : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted hover:text-primary-fixed transition-colors uppercase tracking-wider">
            [ Return to Site ]
          </Link>
        </div>
      </div>
    </div>
  );
}
