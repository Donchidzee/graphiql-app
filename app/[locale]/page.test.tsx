// hooks.test.ts
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import Page from './page'; // Component under test

import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  CollectionReference,
  QueryFieldFilterConstraint,
  Query,
} from 'firebase/firestore';

import type { MockedFunction } from 'vitest';
import type { RootState, AppDispatch } from '../store/store'; // Adjust the path as needed
import type { User } from 'firebase/auth';
import type { ReactNode, AnchorHTMLAttributes } from 'react';

// Mock 'react-redux' hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock('../../firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../routing', () => ({
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

// Type-safe mocks using Vitest's MockedFunction
const mockedUseAuthState = useAuthState as MockedFunction<typeof useAuthState>;
const mockedCollection = collection as unknown as MockedFunction<
  typeof collection
>;
const mockedGetDocs = getDocs as MockedFunction<typeof getDocs>;
const mockedQuery = query as unknown as MockedFunction<typeof query>;
const mockedWhere = where as MockedFunction<typeof where>;

describe('Page Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    // Define the mock return value with precise types
    mockedUseAuthState.mockReturnValue([null, true, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<Page />);
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('fetches and displays the user name when authenticated', async () => {
    // Define a mock user with proper typing
    const mockUser: Partial<User> = { uid: '123' };
    mockedUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    // Define mock Firestore responses with proper types
    const mockCollectionInstance = {} as CollectionReference<DocumentData>;
    const mockQueryInstance = {} as Query<DocumentData>;
    const mockDocs: Array<{ data: () => DocumentData }> = [
      {
        data: () => ({ name: 'Test User' }),
      },
    ];

    mockedCollection.mockReturnValue(mockCollectionInstance);
    mockedWhere.mockReturnValue({
      type: 'where',
      fieldPath: 'uid',
      opStr: '==',
      value: '123',
    } as QueryFieldFilterConstraint);
    mockedQuery.mockReturnValue(mockQueryInstance);
    mockedGetDocs.mockResolvedValue({
      docs: mockDocs,
      metadata: {},
      query: mockQueryInstance,
      size: mockDocs.length,
      empty: mockDocs.length === 0,
      forEach: (callback: (doc: { data: () => DocumentData }) => void) => {
        mockDocs.forEach(callback);
      },
    } as QuerySnapshot<DocumentData>);

    render(<Page />);
    expect(
      await screen.findByText('welcomeBack, Test User!')
    ).toBeInTheDocument();
  });

  it('renders correctly when no user is authenticated', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<Page />);

    expect(screen.getByText('welcome!')).toBeInTheDocument();

    const loginLinkTop = screen.getByTestId('login-link-top');
    expect(loginLinkTop).toHaveAttribute('href', '/login');

    const loginLinkBottom = screen.getByTestId('login-link-bottom');
    expect(loginLinkBottom).toHaveAttribute('href', '/login');

    const registerLink = screen.getByText('register');
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('renders correct links for authenticated users', async () => {
    const mockUser: Partial<User> = { uid: '123' };
    mockedUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    const mockCollectionInstance = {} as CollectionReference<DocumentData>;
    const mockQueryInstance = {} as Query<DocumentData>;
    const mockDocs: Array<{ data: () => DocumentData }> = [
      {
        data: () => ({ name: 'Test User' }),
      },
    ];

    mockedCollection.mockReturnValue(mockCollectionInstance);
    mockedWhere.mockReturnValue({
      type: 'where',
      fieldPath: 'uid',
      opStr: '==',
      value: '123',
    } as QueryFieldFilterConstraint);
    mockedQuery.mockReturnValue(mockQueryInstance);
    mockedGetDocs.mockResolvedValue({
      docs: mockDocs,
      metadata: {},
      query: mockQueryInstance,
      size: mockDocs.length,
      empty: mockDocs.length === 0,
      forEach: (callback: (doc: { data: () => DocumentData }) => void) => {
        mockDocs.forEach(callback);
      },
    } as QuerySnapshot<DocumentData>);

    render(<Page />);

    await screen.findByText('welcomeBack, Test User!');

    const restLink = screen.getByText('Rest');
    const graphQLLink = screen.getByText('GraphQL');
    const historyLink = screen.getByText('history');

    expect(restLink.closest('a')).toHaveAttribute('href', '/api/rest/GET');
    expect(graphQLLink.closest('a')).toHaveAttribute(
      'href',
      '/api/graph/GRAPHQL'
    );
    expect(historyLink.closest('a')).toHaveAttribute('href', '/api/history');
  });

  it('renders correct links for unauthenticated users', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<Page />);

    const loginLinkTop = screen.getByTestId('login-link-top');
    expect(loginLinkTop).toHaveAttribute('href', '/login');

    const loginLinkBottom = screen.getByTestId('login-link-bottom');
    expect(loginLinkBottom).toHaveAttribute('href', '/login');

    const registerLink = screen.getByText('register');
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('renders additional content correctly', () => {
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<Page />);

    expect(screen.getByText('overview!')).toBeInTheDocument();
    expect(screen.getByText('ourApp.')).toBeInTheDocument();
    expect(screen.getByText('postman.')).toBeInTheDocument();
    expect(screen.getByText('graphQl.')).toBeInTheDocument();
    expect(screen.getByText('meetOurTeam!')).toBeInTheDocument();
    expect(screen.getByText('ourTeam.')).toBeInTheDocument();
  });

  it('renders conditional content based on authentication', async () => {
    const mockUser: Partial<User> = { uid: '123' };
    mockedUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    const mockCollectionInstance = {} as CollectionReference<DocumentData>;
    const mockQueryInstance = {} as Query<DocumentData>;
    const mockDocs: Array<{ data: () => DocumentData }> = [
      {
        data: () => ({ name: 'Test User' }),
      },
    ];

    mockedCollection.mockReturnValue(mockCollectionInstance);
    mockedWhere.mockReturnValue({
      type: 'where',
      fieldPath: 'uid',
      opStr: '==',
      value: '123',
    } as QueryFieldFilterConstraint);
    mockedQuery.mockReturnValue(mockQueryInstance);
    mockedGetDocs.mockResolvedValue({
      docs: mockDocs,
      metadata: {},
      query: mockQueryInstance,
      size: mockDocs.length,
      empty: mockDocs.length === 0,
      forEach: (callback: (doc: { data: () => DocumentData }) => void) => {
        mockDocs.forEach(callback);
      },
    } as QuerySnapshot<DocumentData>);

    render(<Page />);

    await screen.findByText('welcomeBack, Test User!');
    expect(screen.getByText('clickAny.')).toBeInTheDocument();

    // Update the auth state to unauthenticated
    mockedUseAuthState.mockReturnValue([null, false, undefined] as [
      User | null,
      boolean,
      Error | undefined,
    ]);

    render(<Page />);

    const loginLinkBottom = screen.getByTestId('login-link-bottom');
    expect(loginLinkBottom).toHaveAttribute('href', '/login');
    expect(screen.getByText('toStartExploring.')).toBeInTheDocument();
  });
});
