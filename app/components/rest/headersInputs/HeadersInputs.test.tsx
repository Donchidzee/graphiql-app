import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import restInputsReducer from '../../../store/slices/restInputsSlice';
import HeadersInputs from './HeadersInputs';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const renderWithStore = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      restInputs: restInputsReducer,
    },
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <HeadersInputs />
    </Provider>
  );
};

describe('HeadersInputs', () => {
  it('renders the headers accordion and the "newHeader" btn', () => {
    renderWithStore({
      restInputs: {
        headers: [{ headerIndex: 0, key: 'ccc', value: '123' }],
      },
    });

    expect(screen.getByText('headers')).toBeInTheDocument();
    expect(screen.getByText('newHeader')).toBeInTheDocument();
  });

  it('newHeader btn click adds a new header"', () => {
    renderWithStore({
      restInputs: {
        headers: [],
      },
    });

    const button = screen.getByText('newHeader');
    fireEvent.click(button);

    const keyLabel = screen.getByText('key');
    const valueLabel = screen.getByText('value');

    const keyInput = keyLabel.nextElementSibling as HTMLInputElement;
    const valueInput = valueLabel.nextElementSibling as HTMLInputElement;

    expect(keyInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
  });

  it('updates the key and value', () => {
    renderWithStore({
      restInputs: {
        headers: [{ headerIndex: 0, key: '', value: '' }],
      },
    });

    const keyLabel = screen.getByText('key');
    const valueLabel = screen.getByText('value');

    const keyInput = keyLabel.nextElementSibling as HTMLInputElement;
    const valueInput = valueLabel.nextElementSibling as HTMLInputElement;

    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    expect(keyInput.value).toBe('Authorization');

    fireEvent.change(valueInput, { target: { value: 'Bearer token' } });
    expect(valueInput.value).toBe('Bearer token');
  });
});
