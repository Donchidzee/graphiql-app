'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, CircularProgress, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import styles from './styles.module.css';
import { auth, db, logout } from '../firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

export default function Page() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');

  const fetchUserName = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchUserName();
    }
  }, [user, loading]);

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
          <h1>{`Welcome back, ${name}!`}</h1>
        ) : (
          <>
            <h1>Welcome!</h1>
            <div className={styles.container}>
              <Link
                as={NextLink}
                href="/login"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                className={styles.authLink}
              >
                Sign in
              </Link>
              <Link
                as={NextLink}
                href="/register"
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                className={styles.authLink}
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
