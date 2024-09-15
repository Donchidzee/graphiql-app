import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Header } from './header';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../../../firebase';
import { useTranslations } from 'next-intl';
import LanguagePicker from '../LanguagesPicker/LanguagePicker';
import { LinkInter } from '../../../routing';
import type { MockedFunction } from 'vitest';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('../../../firebase', () => ({
  auth: {},
  logout: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../LanguagesPicker/LanguagePicker', () => ({
  default: () => <div data-testid="language-picker">LanguagePicker</div>,
}));

vi.mock('../../../routing', () => ({
  LinkInter: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock('./styles.module.css', () => ({
  default: {},
  header: 'header',
  navContainer: 'navContainer',
  nav: 'nav',
  rightContainer: 'rightContainer',
}));

vi.spyOn(window, 'alert').mockImplementation(() => {});

const mockedUseAuthState = useAuthState as MockedFunction<typeof useAuthState>;
const mockedLogout = logout as MockedFunction<typeof logout>;

describe('Header Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    render(
      <ChakraProvider>
        <Header />
      </ChakraProvider>
    );
  };

  it('renders loading state when authentication is loading', () => {
    mockedUseAuthState.mockReturnValue([null, true, undefined]);
    renderHeader();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders authenticated navigation links and logout button when user is authenticated', () => {
    const mockUser = { uid: 'user123' } as any;
    mockedUseAuthState.mockReturnValue([mockUser, false, undefined]);
    renderHeader();
    expect(screen.getByRole('link', { name: /main/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /rest/i })).toHaveAttribute(
      'href',
      '/api/rest/GET'
    );
    expect(screen.getByRole('link', { name: /graphql/i })).toHaveAttribute(
      'href',
      '/api/graph/GRAPHQL'
    );
    expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute(
      'href',
      '/api/history'
    );
    const logoutButton = screen.getByRole('button', { name: /exit/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockUser = { uid: 'user123' } as any;
    mockedUseAuthState.mockReturnValue([mockUser, false, undefined]);
    renderHeader();
    const logoutButton = screen.getByRole('button', { name: /exit/i });
    fireEvent.click(logoutButton);
    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });

  it('renders navigation links and authentication links when user is not authenticated', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    renderHeader();
    expect(screen.getByRole('link', { name: /main/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute(
      'href',
      '/register'
    );
    expect(
      screen.queryByRole('button', { name: /exit/i })
    ).not.toBeInTheDocument();
  });

  it('renders LanguagePicker component', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    renderHeader();
    expect(screen.getByTestId('language-picker')).toBeInTheDocument();
  });
});
