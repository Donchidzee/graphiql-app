import { Link } from '@chakra-ui/react';
import Image from 'next/image';
import styles from './styles.module.css';

export function Footer() {
  return (
    <>
      <div className={styles.footer}>
        <Link href="https://rs.school/courses/reactjs" isExternal>
          <Image
            src={'/rss-logo.svg'}
            alt="rss-logo"
            width="34"
            height="34"
            priority
          />
        </Link>
        <div className={styles.year}>2024</div>
        <div className={styles.authors}>
          <h3 className={styles.authorsTitle}>Authors</h3>
          <div className={styles.authorsList}>
            <Link href="https://github.com/AigerimR" isExternal>
              aigerimr
            </Link>
            <Link href="https://github.com/samekeekz" isExternal>
              samekeekz
            </Link>
            <Link href="https://github.com/Donchidzee" isExternal>
              donchidzee
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
