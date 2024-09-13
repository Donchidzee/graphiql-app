'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../../../firebase';
import { Button, Link } from '@chakra-ui/react';
import styles from './styles.module.css';
import LanguagePicker from '@/components/LanguagesPicker';
import { useTranslations } from 'next-intl';
import { LinkInter } from '../../../routing';

export function Header() {
  const [user, loading] = useAuthState(auth);
  const t = useTranslations();

  return (
    <div className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.nav}>
          <Link
            as={LinkInter}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href={`/`}
          >
            {t('main')}
          </Link>
          {user ? (
            <>
              <Link
                as={LinkInter}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                href={`/api/rest/GET`}
              >
                Rest
              </Link>
              <Link
                as={LinkInter}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                href={`/api/graph/GRAPHQL`}
              >
                GraphQL
              </Link>
              <Link
                href={`/api/history`}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
                as={LinkInter}
              >
                History
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={styles.rightContainer}>
        <LanguagePicker />
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <Button onClick={logout} colorScheme="teal" size="sm">
            {t('exit')}
          </Button>
        ) : (
          <>
            <Link
              as={LinkInter}
              color="blue.400"
              _hover={{ color: 'blue.500' }}
              href={`/login`}
            >
              {t('login')}
            </Link>
            <Link
              as={LinkInter}
              color="blue.400"
              _hover={{ color: 'blue.500' }}
              href={`/register`}
            >
              {t('register')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
