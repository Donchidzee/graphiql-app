import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {  render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import History from './page';

vi.mock('@/hooks/useAuthCheck', () => ({
  default: () => {},
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

beforeEach(() => {
  localStorage.clear();
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useParams: () => ({
    method: 'GET',
    url: ['', 'dGVzdA=='],
    locale: 'en',
  }),
  usePathname: () => '/path',
  useSearchParams: () => ({
    toString: () => 'param1=value1&param2=value2',
    entries: () => [
      ['param1', 'value1'],
      ['param2', 'value2'],
    ],
  }),
}));


describe('History Component', () => {
  it('renders without crashing', () => {
    render(<History />);
    expect(screen.getByText('history')).toBeInTheDocument();
  });

  it('displays "noHistory" message if no history is present', () => {
    render(<History />);
    expect(screen.getByText('noHistory')).toBeInTheDocument();
  });

  it('displays request history if present', () => {
    const mockRequestHistory = [
      { endpoint: 'https://api.sample.com/1' },
      { endpoint: 'https://api.sample.com/2' },
    ];
    localStorage.setItem('requestHistory', JSON.stringify(mockRequestHistory));

    render(<History />);

    expect(screen.getByText('request #1')).toBeInTheDocument();
    expect(screen.getByText('https://api.sample.com/1')).toBeInTheDocument();
    expect(screen.getByText('request #2')).toBeInTheDocument();
    expect(screen.getByText('https://api.sample.com/2')).toBeInTheDocument();
  });

  it('displays graphql history if present', () => {
    const mockGraphqlHistory = [
      { endpoint: 'https://api.sample.com/graphql/1' },
      { endpoint: 'https://api.sample.com/graphql/2' },
    ];
    localStorage.setItem('graphqlRequestHistory', JSON.stringify(mockGraphqlHistory));

    render(<History />);

    expect(screen.getByText('request #1')).toBeInTheDocument();
    expect(screen.getByText('https://api.sample.com/graphql/1')).toBeInTheDocument();
    expect(screen.getByText('request #2')).toBeInTheDocument();
    expect(screen.getByText('https://api.sample.com/graphql/2')).toBeInTheDocument();
  });
});
