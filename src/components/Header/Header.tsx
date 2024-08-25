'use client';

import React from 'react';
import styles from './header.module.scss';
import {
  Box,
  Button,
  Flex,
  Link,
  Spacer,
  Stack,
  Switch,
} from '@chakra-ui/react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Flex>
        <Box>
          <Link href="https://rs.school/">
            <Image
              src="/images/rss-logo.svg"
              alt="rss-logo"
              width={40}
              height={40}
            />
          </Link>
        </Box>
        <Spacer />
        <Stack spacing={10} align="center" direction="row">
          <Switch colorScheme="teal" size="lg" />
          <Button colorScheme="teal" size="md" textTransform="uppercase">
            Sign out
          </Button>
        </Stack>
      </Flex>
    </div>
  );
};

export default Header;
