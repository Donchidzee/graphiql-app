import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  sendPasswordReset: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../../../routing', () => ({
  LinkInter: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

import HookForm from './page';
import { useAuthState } from 'react-firebase-hooks/auth';
import { sendPasswordReset } from '../../../../firebase';

import type { MockedFunction } from 'vitest';

const mockedUseAuthState = useAuthState as MockedFunction<typeof useAuthState>;
const mockedSendPasswordReset = sendPasswordReset as MockedFunction<
  typeof sendPasswordReset
>;

describe('HookForm Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state when loading is true', () => {
    mockedUseAuthState.mockReturnValue([null, true, undefined]);
    render(<HookForm />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('redirects to home if user is authenticated and not loading', () => {
    mockedUseAuthState.mockReturnValue([
      { uid: '123' } as any,
      false,
      undefined,
    ]);
    render(<HookForm />);
    expect(pushMock).toHaveBeenCalledWith(`/`);
  });

  it('renders the reset password form when not loading and no user', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    render(<HookForm />);
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'resetButton' })
    ).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    render(<HookForm />);
    const submitButton = screen.getByRole('button', { name: 'resetButton' });
    await userEvent.click(submitButton);
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    render(<HookForm />);
    await userEvent.type(screen.getByLabelText('email'), 'invalid-email');
    const submitButton = screen.getByRole('button', { name: 'resetButton' });
    await userEvent.click(submitButton);
    expect(
      await screen.findByText('Invalid email address')
    ).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    mockedSendPasswordReset.mockResolvedValue(undefined);
    render(<HookForm />);
    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    const submitButton = screen.getByRole('button', { name: 'resetButton' });
    await userEvent.click(submitButton);
    expect(sendPasswordReset).toHaveBeenCalledWith('test@example.com');
    expect(submitButton).toBeEnabled();
  });

  it('contains navigation link to sign up page', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined]);
    render(<HookForm />);
    const signUpLink = screen.getByText('signUp');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
