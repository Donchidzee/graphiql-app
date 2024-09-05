'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, CircularProgress, Box } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import styles from './styles.module.css';
import { auth, db } from '../firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

export default function Page() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');

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
                as={NextLink}
                href="/api/rest/GET"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                mr={10}
              >
                Rest
              </Link>
              <Link
                as={NextLink}
                href="/api/graph/GRAPHQL"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
              >
                GraphQL
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome!</h1>
            <div className={styles.container}>
              <Link
                as={NextLink}
                href="/login"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                mr={10}
              >
                Sign in
              </Link>
              <Link
                as={NextLink}
                href="/register"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
