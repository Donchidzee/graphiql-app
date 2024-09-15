'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

interface TokenPayload {
  exp: number;
  [key: string]: unknown;
}

const useAuthCheck = (): boolean | null => {
  const [cookies] = useCookies(['token']);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = cookies.token;

    if (!token) {
      setIsAuthenticated(false);
      router.push('/');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error('Invalid token format');

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(base64);
      const payload: TokenPayload = JSON.parse(payloadJson);

      if (!payload.exp) throw new Error('Token does not have an exp claim');

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        setIsAuthenticated(false);
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      console.log(error);
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [cookies.token, router]);

  return isAuthenticated;
};

export default useAuthCheck;
