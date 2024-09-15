import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from './layout';
import { Box } from '@chakra-ui/react';

describe('AuthLayout Component', () => {
  it('renders children inside the AuthLayout', () => {
    const mockChildText = 'Test Child Content';

    render(
      <AuthLayout>
        <div>{mockChildText}</div>
      </AuthLayout>
    );

    expect(screen.getByText(mockChildText)).to.exist;
  });

  it('applies the correct styles to the Box component', () => {
    const { container } = render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    const boxElement = container.querySelector('div[class*="formWrapper"]');
    expect(boxElement).to.exist;
  });
});
