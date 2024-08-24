'use client';

import React from 'react';
import styles from './header.module.scss';
import { Button, Stack, Switch } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Stack align="center" direction="row">
        <p>LOGO</p>
        <Switch colorScheme="teal" size="lg" />
        <Button colorScheme="teal" size="md" textTransform="uppercase">
          Sign out
        </Button>
      </Stack>
    </div>
  );
};

export default Header;
