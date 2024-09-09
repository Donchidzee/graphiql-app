'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, CircularProgress, Link } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './styles.module.css';
import { auth, db } from '../../firebase';
import { useTranslations } from 'next-intl';
import { LinkInter } from '../../routing';

export default function Page() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');
  const t = useTranslations();

  const fetchUserName = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert('An error occurred while fetching user data');
    }
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      fetchUserName();
    }
  }, [user, loading, fetchUserName]);

  if (loading) {
    return (
      <Box
        className={styles.page}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress isIndeterminate size="100px" thickness="4px" />
      </Box>
    );
  }

  return (
    <>
      <div className={styles.page}>
        {user ? (
          <>
            <h1>{`Welcome back, ${name}!`}</h1>
            <div className={styles.container}>
              <Link
                as={LinkInter}
                href={`/api/rest/GET`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                mr={10}
              >
                Rest
              </Link>
              <Link
                as={LinkInter}
                href={`/api/graph/GRAPHQL`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                mr={10}
              >
                GraphQL
              </Link>
              <Link
                as={LinkInter}
                href={`/api/history`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
              >
                History
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome!</h1>
            <div className={styles.container}>
              <Link
                as={LinkInter}
                href={`/login`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                mr={10}
              >
                {t('login')}
              </Link>
              <Link
                as={LinkInter}
                href={`/register`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
              >
                {t('register')}
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
