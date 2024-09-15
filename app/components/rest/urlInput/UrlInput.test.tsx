import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import UrlInput from './UrlInput';
import { RootState, store } from '../../../store/store';
import { changeUrl } from '../../../store/slices/restInputsSlice';

describe('URLinput', () => {
  it('render url component', () => {
    render(
      <Provider store={store}>
        <UrlInput />
      </Provider>
    );

    const inputElement = screen.getByText(/url/i);
    expect(inputElement).toBeInTheDocument();
  });
});

vi.useFakeTimers();
type ReactReduxModule = {
  useDispatch: () => typeof mockDispatch;
  useSelector: <T>(selector: (state: RootState) => T) => T;
  Provider: typeof Provider;
};
vi.mock('react-redux', async (importOriginal) => {
  const actual = (await importOriginal()) as ReactReduxModule;
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const mockDispatch = vi.fn();

describe('URLinput', () => {
  it('dispatches changeUrl action on input change', () => {
    render(
      <Provider store={store}>
        <UrlInput />
      </Provider>
    );

    const inputElement = screen.getByRole('textbox');

    fireEvent.change(inputElement, { target: { value: 'http://google.com' } });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockDispatch).toHaveBeenCalledWith(changeUrl('http://google.com'));
  });
});
