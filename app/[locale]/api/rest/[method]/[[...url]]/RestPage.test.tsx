import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NextIntlClientProvider } from 'next-intl';
import Rest from './page';
import { RootState } from '@/store/store';

const enlocale = {
  test: 'This is a test',
  register: 'Sign up',
  login: 'Sign in',
  main: 'Main',
  forgot: 'Forgot password',
  exit: 'Sign out',
  run: 'Run Query',
  loading: 'Loading...',
  status: 'Status',
  method: 'Method',
  url: 'URL',
  request: 'Request',
  response: 'Response',
  variables: 'Variables',
  headers: 'Headers',
  query: 'Query',
  body: 'Body',
  send: 'Send',
  clear: 'Clear',
  copy: 'Copy',
  save: 'Save',
  delete: 'Delete',
  Documentation: 'Documentation',
  noSchema: 'Documentation would be available after successful query response.',
  newHeader: 'New Header',
  newVariable: 'New Variable',
  key: 'key',
  value: 'value',
  text: 'Text',
  bodyText: 'Body in text format',
  bodyJson: 'Body in json format',
  restfull: 'RESTfull client',
  history: 'history',
  noHistory: 'You have not executed any requests yet',
  responseNotOk: 'There is a problem with request',
};

const mockReducer = (state: RootState = { restInputs: {
  url: '',
  urlError: false,
  body: '',
  headers: [],
  RequestHistory: []
} }, action: any) => {
  switch (action.type) {
    case 'changeBody':
      return { ...state, restInputs: { ...state.restInputs, body: action.payload } };
    case 'changeUrl':
      return { ...state, restInputs: { ...state.restInputs, url: action.payload } };
    case 'changeHeaders':
      return { ...state, restInputs: { ...state.restInputs, headers: action.payload } };
    case 'changeUrlError':
      return { ...state, restInputs: { ...state.restInputs, urlError: action.payload } };
    default:
      return state;
  }
};


const renderComponent = (storeState: RootState = { restInputs: {
  url: '', body: '', headers: [], urlError: false,
  RequestHistory: []
} }) => {
  const store = configureStore({ 
    reducer: mockReducer,
    preloadedState: storeState
  });

  return render(
    <NextIntlClientProvider locale="en" messages={enlocale}>
      <Provider store={store}>
        <Rest />
      </Provider>
    </NextIntlClientProvider>
  );
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({
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

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: 'response' }),
  })
) as unknown as ReturnType<typeof vi.fn>;

describe('RestPage', () => {
  it('renders correctly', () => {
    renderComponent();


    expect(screen.getByText('RESTfull client')).toBeInTheDocument();
    expect(screen.getByText('Request')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeDisabled();

  });

  it('calls handleSendRequest on button click', async () => {
    const { getByText } = renderComponent({
      restInputs: { url: 'http://google.com', body: '', headers: [], urlError: false, RequestHistory: [] }
    });

    const sendButton = getByText('Send');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://google.com', expect.any(Object));
    });
  });
});
