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
            color="white"
            fontWeight={600}
            _hover={{ color: '#1b202b' }}
            href={`/`}
          >
            {t('main')}
          </Link>
          {user ? (
            <>
              <Link
                as={LinkInter}
                color="white"
                fontWeight={600}
                _hover={{ color: '#1b202b' }}
                href={`/api/rest/GET`}
              >
                Rest
              </Link>
              <Link
                as={LinkInter}
                color="white"
                fontWeight={600}
                _hover={{ color: '#1b202b' }}
                href={`/api/graph/GRAPHQL`}
              >
                GraphQL
              </Link>
              <Link
                href={`/api/history`}
                color="white"
                fontWeight={600}
                _hover={{ color: '#1b202b' }}
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
          <Button onClick={logout} backgroundColor={'#1b202b'} size="sm">
            {t('exit')}
          </Button>
        ) : (
          <>
            <Link
              as={LinkInter}
              color="white"
              fontWeight={600}
              _hover={{ color: '#1b202b' }}
              href={`/login`}
            >
              {t('login')}
            </Link>
            <Link
              as={LinkInter}
              color="white"
              fontWeight={600}
              _hover={{ color: '#1b202b' }}
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
