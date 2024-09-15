import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';

describe('Footer Component', () => {
  it('renders the RSS logo with the correct link', () => {
    render(
      <ChakraProvider>
        <Footer />
      </ChakraProvider>
    );

    const rssLogo = screen.getByAltText('rss-logo');
    expect(rssLogo).toBeInTheDocument();
    expect(rssLogo).toHaveAttribute('src', '/rss-logo.svg');

    const rssLink = screen.getByRole('link', { name: /rss-logo/i });
    expect(rssLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(rssLink).toHaveAttribute('target', '_blank');
  });

  it('displays the correct year', () => {
    render(
      <ChakraProvider>
        <Footer />
      </ChakraProvider>
    );

    const yearText = screen.getByText('2024');
    expect(yearText).toBeInTheDocument();
  });

  it('renders author links correctly', () => {
    render(
      <ChakraProvider>
        <Footer />
      </ChakraProvider>
    );

    const aigerimrLink = screen.getByRole('link', { name: /aigerimr/i });
    expect(aigerimrLink).toBeInTheDocument();
    expect(aigerimrLink).toHaveAttribute('href', 'https://github.com/AigerimR');
    expect(aigerimrLink).toHaveAttribute('target', '_blank');

    const samekeekzLink = screen.getByRole('link', { name: /samekeekz/i });
    expect(samekeekzLink).toBeInTheDocument();
    expect(samekeekzLink).toHaveAttribute(
      'href',
      'https://github.com/samekeekz'
    );
    expect(samekeekzLink).toHaveAttribute('target', '_blank');

    const donchidzeeLink = screen.getByRole('link', { name: /donchidzee/i });
    expect(donchidzeeLink).toBeInTheDocument();
    expect(donchidzeeLink).toHaveAttribute(
      'href',
      'https://github.com/Donchidzee'
    );
    expect(donchidzeeLink).toHaveAttribute('target', '_blank');
  });
});
