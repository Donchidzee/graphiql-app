// app/hooks/useAuthCheck.test.ts

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import useAuthCheck from './useAuthCheck';

// ===========================
// 1. Define Global atob and btoa Functions
// ===========================

// Mock the atob function globally using Node's Buffer
global.atob = (input: string) => {
  try {
    return Buffer.from(input, 'base64').toString('binary');
  } catch (error) {
    console.error('An error occurred:', error);
    throw new DOMException(
      'The string to be decoded is not correctly encoded.',
      'InvalidCharacterError'
    );
  }
};

// Mock the btoa function globally using Node's Buffer
global.btoa = (input: string) => {
  return Buffer.from(input, 'binary').toString('base64');
};

// ===========================
// 2. Mock External Modules
// ===========================

// Mock 'next/navigation' to control router behavior
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock 'react-cookie' to control cookie state
vi.mock('react-cookie', () => ({
  useCookies: vi.fn(),
}));

describe('useAuthCheck', () => {
  let pushMock: Mock;
  const mockUseCookies = useCookies as unknown as Mock;
  const mockUseRouter = useRouter as unknown as Mock;

  beforeEach(() => {
    pushMock = vi.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUseCookies.mockReturnValue([{ token: null }, vi.fn()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false and redirect to "/" if no token is present', () => {
    // Arrange: No token in cookies
    mockUseCookies.mockReturnValue([{ token: null }, vi.fn()]);

    // Act: Render the hook
    const { result } = renderHook(() => useAuthCheck());

    // Assert: Expect redirection and auth state to be false
    expect(result.current).toBe(false);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('should return false and redirect to "/" if token is expired', () => {
    // Arrange: Expired token in cookies
    const expiredToken = btoa(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) - 1000, // Expired time
      })
    );
    mockUseCookies.mockReturnValue([
      { token: `header.${expiredToken}.signature` },
      vi.fn(),
    ]);

    // Act: Render the hook
    const { result } = renderHook(() => useAuthCheck());

    // Assert: Expect redirection and auth state to be false
    expect(result.current).toBe(false);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('should return true if token is valid', () => {
    // Arrange: Valid token in cookies
    const validToken = btoa(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 1000, // Future expiry time
      })
    );
    mockUseCookies.mockReturnValue([
      { token: `header.${validToken}.signature` },
      vi.fn(),
    ]);

    // Act: Render the hook
    const { result } = renderHook(() => useAuthCheck());

    // Assert: Auth state should be true
    expect(result.current).toBe(true);
    expect(pushMock).not.toHaveBeenCalled();
  });
});
