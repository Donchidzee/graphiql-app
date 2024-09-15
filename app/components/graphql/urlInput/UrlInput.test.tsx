import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';
import UrlInput from './UrlInput';

const mockSetUrlValue = vi.fn();

describe('UrlInput Component', () => {
  test('renders with initial URL value', () => {
    render(
      <UrlInput urlValue="http://example.com" setUrlValue={mockSetUrlValue} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('http://example.com');
  });

  test('calls setUrlValue on input change', () => {
    render(
      <UrlInput urlValue="http://example.com" setUrlValue={mockSetUrlValue} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://newurl.com' } });

    expect(mockSetUrlValue).toHaveBeenCalledWith('http://newurl.com');
  });
});
