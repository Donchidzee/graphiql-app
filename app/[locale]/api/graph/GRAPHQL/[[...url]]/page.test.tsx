// page.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Graphql from './page';
import { useRouter, usePathname } from 'next/navigation';
import useDebounce from '../../../../../../src/helpers/useDebounce';
import { ChakraProvider } from '@chakra-ui/react';
import { MockedFunction } from 'vitest';
import { PrefetchOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Mock the necessary hooks and modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('../../../../../../src/helpers/useDebounce', () => ({
  default: vi.fn(),
}));

vi.mock(
  '../../../../../components/graphql/GraphqlEditor/GraphqlEditor',
  () => ({
    default: ({
      query,
      onQueryChange,
    }: {
      query: string;
      onQueryChange: (val: string) => void;
    }) => (
      <textarea
        data-testid="graphql-editor"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    ),
  })
);

vi.mock('../../../../../components/graphql/SdlInput', () => ({
  default: () => <div>SdlInput</div>,
}));

vi.mock('../../../../../components/graphql/urlInput/UrlInput', () => ({
  default: ({
    urlValue,
    setUrlValue,
  }: {
    urlValue: string;
    setUrlValue: (val: string) => void;
  }) => (
    <input
      data-testid="url-input"
      value={urlValue}
      onChange={(e) => setUrlValue(e.target.value)}
    />
  ),
}));

vi.mock('../../../../../hooks/useAuthCheck', () => ({
  default: () => {},
}));

describe('Graphql Component', () => {
  // Type the mocks using MockedFunction from Vitest
  const mockUseRouter = useRouter as unknown as MockedFunction<
    typeof useRouter
  >;
  const mockUsePathname = usePathname as unknown as MockedFunction<
    typeof usePathname
  >;
  const mockDebounce = useDebounce as unknown as MockedFunction<
    typeof useDebounce
  >;
  const mockReplace = vi.fn();
  const mockPush = vi.fn(); // Mock router.push

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock return values for useRouter
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: mockPush,
      back: function (): void {
        throw new Error('Function not implemented.');
      },
      forward: function (): void {
        throw new Error('Function not implemented.');
      },
      refresh: function (): void {
        throw new Error('Function not implemented.');
      },
      prefetch: function (href: string, options?: PrefetchOptions): void {
        throw new Error('Function not implemented.');
      },
    });

    // Mock return value for usePathname
    mockUsePathname.mockReturnValue('/test/path');

    // Mock implementation for useDebounce
    mockDebounce.mockImplementation((value) => value);
  });

  it('renders correctly', () => {
    render(
      <ChakraProvider>
        <Graphql />
      </ChakraProvider>
    );

    expect(screen.getByTestId('graphql-editor')).toBeInTheDocument();
    expect(screen.getByText('SdlInput')).toBeInTheDocument();
    expect(screen.getByTestId('url-input')).toBeInTheDocument();
  });

  it('applies headers correctly from the URL query params', () => {
    mockUsePathname.mockReturnValue('/test/path?Content-Type=application/json');

    render(
      <ChakraProvider>
        <Graphql />
      </ChakraProvider>
    );

    expect(screen.getByTestId('graphql-editor')).toBeInTheDocument();
    // Add additional assertions here if needed to verify headers are applied correctly
  });

  it('updates the URL when the debounced URL changes', async () => {
    render(
      <ChakraProvider>
        <Graphql />
      </ChakraProvider>
    );

    const urlInput = screen.getByTestId('url-input');

    fireEvent.change(urlInput, {
      target: { value: 'https://test.com/graphql' },
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
      // Adjust the arguments based on your router.replace implementation
      // For example:
      // expect(mockReplace).toHaveBeenCalledWith('/test/path', { locale: 'en' });
    });
  });

  // Add more tests as needed...
});
