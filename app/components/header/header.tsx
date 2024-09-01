'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, logout } from '../../../firebase';
import { Button, Select } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import styles from './styles.module.css';

export function Header() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className={styles.header}>
        <div>La Penna</div>
        <div className={styles.container}>
          <div className={styles.languageSelectWrapper}>
            <Select size="xs" defaultValue={'ru'}>
              <option value="ru">ru</option>
              <option value="en">en</option>
            </Select>
          </div>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <Button onClick={logout} colorScheme="teal" size="sm">
              Sign out
            </Button>
          ) : (
            <Link
              as={NextLink}
              color="blue.400"
              _hover={{ color: 'blue.500' }}
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
