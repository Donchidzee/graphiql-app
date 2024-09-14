import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';

import { store } from '../../../store/store';
import ResponseArea from './ResponseArea';
import { ResponseAreaProps } from '@/types/restTypes';

const mockResponseValue: ResponseAreaProps['responseValue'] = {
  status: '200 OK',
  data: 'Testing response rendering props',
  headers: new Headers([
    ['Content-Type', 'application/json'],
    ['Authorization', 'Bearer token'],
  ]),
};

describe('ResponseArea', () => {
  it('receives and renders props', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{ status: 'Status', body: 'Body', headers: 'Headers' }}
      >
        <Provider store={store}>
          <ResponseArea responseValue={mockResponseValue} />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(
      screen.getByPlaceholderText(/Testing response rendering props/i)
    ).toBeInTheDocument();
  });
});
