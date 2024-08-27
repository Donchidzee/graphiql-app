import { Select } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import styles from './styles.module.css';

export function Header() {
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
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
