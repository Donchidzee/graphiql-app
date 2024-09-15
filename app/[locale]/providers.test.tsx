import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Providers } from './providers'; // Adjust the path if necessary

describe('Providers Component', () => {
  it('renders children inside the ChakraProvider and Redux Provider', () => {
    const testText = 'This is a child component';

    render(
      <Providers>
        <div>{testText}</div>
      </Providers>
    );

    expect(screen.getByText(testText)).to.exist;
  });
});
