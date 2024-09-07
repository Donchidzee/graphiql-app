'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../../../firebase';
import { Button, Select } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import LanguagePicker from '@/components/LanguagesPicker';
import { useRouter } from 'next/router';

export function Header() {
  const [user, loading] = useAuthState(auth);
  const [language, setLanguage] = useState('ru');
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    router.push({ pathname, query }, asPath, { locale: language });
  }, [language]);

  return (
    <div className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.nav}>
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/"
          >
            Home
          </Link>
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/api/rest/GET"
          >
            Rest
          </Link>
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/api/graph/GRAPHQL"
          >
            Graphql
          </Link>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <LanguagePicker
          selectedLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
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
  );
}
