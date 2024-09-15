import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HookForm from './page';

import { useAuthState } from 'react-firebase-hooks/auth';
import { registerWithEmailAndPassword } from '../../../../firebase';

import type { MockedFunction } from 'vitest';
import type { User } from 'firebase/auth';
import type { ReactNode, AnchorHTMLAttributes } from 'react';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('../../../../firebase', () => ({
  auth: {},
  registerWithEmailAndPassword: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../../../routing', () => ({
  LinkInter: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('./styles.module.css', () => ({
  default: {},
  page: 'page',
  container: 'container',
}));

vi.spyOn(window, 'alert').mockImplementation(() => {});

const mockedUseAuthState = useAuthState as MockedFunction<typeof useAuthState>;
const mockedRegisterWithEmailAndPassword =
  registerWithEmailAndPassword as MockedFunction<
    typeof registerWithEmailAndPassword
  >;

describe('HookForm Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    mockedUseAuthState.mockReturnValue([null, true, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('redirects to home if user is authenticated and not loading', () => {
    const mockUser: Partial<User> = { uid: '123' };
    mockedUseAuthState.mockReturnValue([mockUser as User, false, undefined] as [
      User,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    expect(pushMock).toHaveBeenCalledWith(`/`);
  });

  it('renders the registration form when not loading and no user', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    expect(screen.getByLabelText('username')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await userEvent.click(submitButton);
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('This is required')).toBeInTheDocument();
  });

  it('shows validation error for username too short', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    await userEvent.type(screen.getByLabelText('username'), 'abc');
    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'Password1!');
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await userEvent.click(submitButton);
    expect(
      await screen.findByText('Minimum length should be 4')
    ).toBeInTheDocument();
  });

  it('shows validation error for invalid password', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    await userEvent.type(screen.getByLabelText('username'), 'testuser');
    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'password');
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await userEvent.click(submitButton);
    expect(
      await screen.findByText(
        'Password must contain at least one letter, one number, and one special character'
      )
    ).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);
    mockedRegisterWithEmailAndPassword.mockResolvedValue(undefined);
    render(<HookForm />);
    await userEvent.type(screen.getByLabelText('username'), 'testuser');
    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'Password1!');
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await userEvent.click(submitButton);
    expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
      'testuser',
      'test@example.com',
      'Password1!'
    );
    expect(submitButton).toBeEnabled();
  });

  it('contains navigation link to login page', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<HookForm />);
    const loginLink = screen.getByText('login');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});
