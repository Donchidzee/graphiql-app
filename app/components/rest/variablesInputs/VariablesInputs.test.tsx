import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import VariablesInputs from './VariablesInputs';
import { NextIntlClientProvider } from 'next-intl';
import { store } from '../../..//store/store';

describe('VariablesInputs', () => {
  it('renders correctly with initial state', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          variables: 'Variables',
          newVariable: 'New Variable',
          key: 'Key',
          value: 'Value',
          delete: 'Delete',
        }}
      >
        <Provider store={store}>
          <VariablesInputs />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('New Variable')).toBeInTheDocument();
  });

  it('adds and delets variable on button clicks', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          variables: 'Variables',
          newVariable: 'New Variable',
          key: 'key',
          value: 'value',
          delete: 'delete',
        }}
      >
        <Provider store={store}>
          <VariablesInputs />
        </Provider>
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByText('New Variable'));
    expect(screen.getByText('key')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();

    const keyInput = screen.getAllByText('key')[0];
    const valueInput = screen.getAllByText('value')[0];
    const deleteButton = screen.getAllByText('delete')[0];

    fireEvent.click(deleteButton);

    expect(keyInput).not.toBeInTheDocument();
    expect(valueInput).not.toBeInTheDocument();
  });

  it('edits variables', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          variables: 'Variables',
          newVariable: 'New Variable',
          key: 'key',
          value: 'value',
          delete: 'delete',
        }}
      >
        <Provider store={store}>
          <VariablesInputs />
        </Provider>
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByText('New Variable'));

    const keyLabel = screen.getAllByText('key')[0];
    const valueLabel = screen.getAllByText('value')[0];

    const keyInput = keyLabel.nextElementSibling as HTMLInputElement;
    const valueInput = valueLabel.nextElementSibling as HTMLInputElement;

    fireEvent.change(keyInput, { target: { value: 'testKey' } });
    fireEvent.change(valueInput, { target: { value: 'testValue' } });

    expect(keyInput).toHaveValue('testKey');
    expect(valueInput).toHaveValue('testValue');
  });
});
