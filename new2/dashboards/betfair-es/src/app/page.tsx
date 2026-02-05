'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/betfair');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-text-muted">Cargando...</div>
    </div>
  );
}
