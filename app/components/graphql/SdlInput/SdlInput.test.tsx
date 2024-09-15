import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SdlUrlInput from './SdlInput';

describe('SdlUrlInput Component', () => {
  const mockSetSdlUrlValue = vi.fn();

  beforeEach(() => {
    localStorage.clear();
  });

  test('renders with initial SDL URL value', () => {
    render(
      <SdlUrlInput
        sdlUrlValue="http://example-sdl.com"
        setSdlUrlValue={mockSetSdlUrlValue}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('http://example-sdl.com');
  });

  test('calls setSdlUrlValue on input change', () => {
    render(
      <SdlUrlInput
        sdlUrlValue="http://example-sdl.com"
        setSdlUrlValue={mockSetSdlUrlValue}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://new-sdl-url.com' } });

    expect(mockSetSdlUrlValue).toHaveBeenCalledWith('http://new-sdl-url.com');
  });
});
