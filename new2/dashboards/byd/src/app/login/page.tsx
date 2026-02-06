'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/byd');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      router.push('/byd');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo section */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Image
            src="/logos/BYD-Logo.png"
            alt="BYD"
            width={120}
            height={48}
            className={`h-12 w-auto ${theme === 'light' ? '' : 'brightness-0 invert'}`}
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-text">LLMCtrl</h1>
            <p className="text-sm text-text-muted">Brand Visibility Monitor</p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-text-muted" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-12 text-text placeholder-text-muted outline-none transition-colors focus:border-text-muted"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-critical">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-text py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted">
          <span>Powered by</span>
          <Image
            src="/logos/interamplify.webp"
            alt="Interamplify"
            width={80}
            height={16}
            className={`h-4 w-auto ${theme === 'light' ? 'brightness-0' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
