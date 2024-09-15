import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguagePicker from './LanguagePicker';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../routing';
import { ChakraProvider } from '@chakra-ui/react';
import type { MockedFunction } from 'vitest';
import {
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('../../../routing', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('LanguagePicker Component', () => {
  const mockUseLocale = useLocale as MockedFunction<typeof useLocale>;
  const mockUseRouter = useRouter as MockedFunction<typeof useRouter>;
  const mockUsePathname = usePathname as MockedFunction<typeof usePathname>;
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseLocale.mockReturnValue('en');
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: function (
        href: string,
        options?: NavigateOptions & { locale?: 'en' | 'ru' }
      ): void {
        throw new Error('Function not implemented.');
      },
      prefetch: function (
        href: string,
        options?: PrefetchOptions & { locale?: 'en' | 'ru' }
      ): void {
        throw new Error('Function not implemented.');
      },
      back: function (): void {
        throw new Error('Function not implemented.');
      },
      forward: function (): void {
        throw new Error('Function not implemented.');
      },
      refresh: function (): void {
        throw new Error('Function not implemented.');
      },
    });
    mockUsePathname.mockReturnValue('/current-path');
  });

  const renderLanguagePicker = () => {
    render(
      <ChakraProvider>
        <LanguagePicker />
      </ChakraProvider>
    );
  };

  it('renders the language picker with the correct default value', () => {
    renderLanguagePicker();
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('en');
  });

  it('changes the language when a new option is selected', () => {
    renderLanguagePicker();
    const selectElement = screen.getByRole('combobox');

    fireEvent.change(selectElement, { target: { value: 'ru' } });
    expect(mockReplace).toHaveBeenCalledWith('/current-path', { locale: 'ru' });
  });
});
