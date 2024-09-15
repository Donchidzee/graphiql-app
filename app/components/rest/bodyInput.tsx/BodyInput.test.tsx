import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import { RootState, store } from '../../../store/store';
import {
  changeBody,
  changeUrlError,
} from '../../../store/slices/restInputsSlice';
import BodyInput from './BodyInput';
import { NextIntlClientProvider } from 'next-intl';

type ReactReduxModule = {
  useDispatch: () => typeof mockDispatch;
  useSelector: <T>(selector: (state: RootState) => T) => T;

  Provider: typeof Provider;
};

const setItemMock = vi.fn();
vi.spyOn(Storage.prototype, 'setItem').mockImplementation(setItemMock);

const mockState: RootState = {
  restInputs: {
    url: 'http://google.com',
    body: '{"abc":"123"}',
    headers: [],
    urlError: false,
    RequestHistory: [],
  },
};

vi.mock('react-redux', async (importOriginal) => {
  const actual = (await importOriginal()) as ReactReduxModule;
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(mockState),
  };
});
const mockDispatch = vi.fn();
describe('Bodyinput', () => {
  it('dispatches changeBody action on text input change', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          text: 'Text',
          bodyText: 'Body in text format',
          bodyJson: 'Body in json format',
        }}
      >
        <Provider store={store}>
          <BodyInput
            bodyTextInputRef={React.createRef()}
            bodyJsonInputRef={React.createRef()}
            handleBodyTextInputFocus={() => {}}
          />
        </Provider>
      </NextIntlClientProvider>
    );

    const bodyTextArea = screen.getByPlaceholderText('Body in text format');
    fireEvent.change(bodyTextArea, {
      target: { value: 'Sample for body text change' },
    });
    fireEvent.blur(bodyTextArea);
    expect(mockDispatch).toHaveBeenCalledWith(
      changeBody('Sample for body text change')
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(changeUrlError(true));
  });

  it('dispatches changeBody action on text input change', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          text: 'Text',
          bodyText: 'Body in text format',
          bodyJson: 'Body in json format',
        }}
      >
        <Provider store={store}>
          <BodyInput
            bodyTextInputRef={React.createRef()}
            bodyJsonInputRef={React.createRef()}
            handleBodyTextInputFocus={() => {}}
          />
        </Provider>
      </NextIntlClientProvider>
    );

    const bodyJsonTextArea = screen.getByPlaceholderText(
      'Body in json format'
    ) as HTMLTextAreaElement;
    fireEvent.change(bodyJsonTextArea, {
      target: { value: '{"abc": "123456"}' },
    });
    const expected = JSON.stringify({ abc: '123456' }, null, 6);
    expect(bodyJsonTextArea.value).toBe(expected);
  });

  it('updates activeTab state in LS', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          text: 'Text',
          bodyText: 'Body in text format',
          bodyJson: 'Body in json format',
        }}
      >
        <Provider store={store}>
          <BodyInput
            bodyTextInputRef={React.createRef()}
            bodyJsonInputRef={React.createRef()}
            handleBodyTextInputFocus={() => {}}
          />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Text')).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('JSON')).toHaveAttribute(
      'aria-selected',
      'false'
    );

    fireEvent.click(screen.getByText('JSON'));

    expect(setItemMock).toHaveBeenCalledWith('activeBodyTab', '1');

    expect(screen.getByText('JSON')).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('Text')).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('renders with initial state and props', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          text: 'Text',
          bodyText: 'Body in text format',
          bodyJson: 'Body in json format',
        }}
      >
        <Provider store={store}>
          <BodyInput
            bodyTextInputRef={React.createRef()}
            bodyJsonInputRef={React.createRef()}
            handleBodyTextInputFocus={() => {}}
          />
        </Provider>
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Text')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Body in text format')).toHaveValue(
      '{"abc":"123"}'
    );
  });

  it('handles focus and blur events', () => {
    const handleBodyTextInputFocus = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          text: 'Text',
          bodyText: 'Body in text format',
          bodyJson: 'Body in json format',
        }}
      >
        <Provider store={store}>
          <BodyInput
            bodyTextInputRef={React.createRef()}
            bodyJsonInputRef={React.createRef()}
            handleBodyTextInputFocus={handleBodyTextInputFocus}
          />
        </Provider>
      </NextIntlClientProvider>
    );

    fireEvent.focus(screen.getByPlaceholderText('Body in text format'));
    expect(handleBodyTextInputFocus).toHaveBeenCalledWith(true);

    fireEvent.blur(screen.getByPlaceholderText('Body in text format'));
    expect(handleBodyTextInputFocus).toHaveBeenCalledWith(false);
  });
});
