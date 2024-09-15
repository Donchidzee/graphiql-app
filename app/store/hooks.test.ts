import { renderHook } from '@testing-library/react';
import { useAppDispatch } from './hooks';
import { useDispatch } from 'react-redux';
import { describe, it, expect, vi, MockedFunction } from 'vitest';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

describe('Redux Hooks', () => {
  const mockUseDispatch = useDispatch as unknown as MockedFunction<
    typeof useDispatch
  >;

  it('should call useDispatch with AppDispatch', () => {
    const mockDispatch = vi.fn();
    mockUseDispatch.mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useAppDispatch());

    expect(result.current).toBe(mockDispatch);
    expect(mockUseDispatch).toHaveBeenCalledTimes(1);
  });
});
