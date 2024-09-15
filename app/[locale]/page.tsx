'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Box,
  CircularProgress,
  Link,
  Card,
  CardBody,
  Text,
  Heading,
} from '@chakra-ui/react';
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
            <Card>
              <CardBody>
                <Heading as="h2" size="md">
                  {`${t('welcomeBack')}, ${name}!`}
                </Heading>
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
                    {t('history')}
                  </Link>
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardBody>
                <Heading as="h2" size="md">
                  {t('welcome')}!
                </Heading>
                <div className={styles.container}>
                  <Link
                    as={LinkInter}
                    href={`/login`}
                    color="blue.400"
                    _hover={{ color: 'blue.500' }}
                    data-testid="login-link-top"
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
              </CardBody>
            </Card>
          </>
        )}
        <Card mt={5}>
          <CardBody>
            <Text>{t('overview')}!</Text>
          </CardBody>
        </Card>
        <Card mt={5}>
          <CardBody>
            <Text mb={4}>{t('ourApp')}.</Text>
            <Text ml={3}>{t('postman')}.</Text>
            <Text ml={3}>{t('graphQl')}.</Text>
          </CardBody>
        </Card>
        <Card mt={5}>
          <CardBody>
            <Text>{t('meetOurTeam')}!</Text>
            <Text>{t('ourTeam')}.</Text>
          </CardBody>
        </Card>
        <Card mt={5}>
          <CardBody>
            {user ? (
              <Text>{t('clickAny')}.</Text>
            ) : (
              <>
                <Box display={'flex'}>
                  <Link
                    as={LinkInter}
                    href={`/login`}
                    color="blue.400"
                    _hover={{ color: 'blue.500' }}
                    data-testid="login-link-bottom"
                    mr={1}
                  >
                    {t('login')}
                  </Link>
                  <Text>{t('toStartExploring')}.</Text>
                </Box>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
