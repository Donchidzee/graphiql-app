'use client';

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import theme from '../../src/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </Provider>
    </>
  );
}
