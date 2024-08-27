'use client';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import styles from './styles.module.css';

export default function Page() {
  return (
    <>
      <div className={styles.page}>
        <h1>Welcome!</h1>
        <div className={styles.container}>
          <Link
            as={NextLink}
            href="/"
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            className={styles.authLink}
          >
            Sign in
          </Link>
          <Link
            as={NextLink}
            href="/"
            color="blue.400"
            _hover={{ color: 'blue.500' }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
}
