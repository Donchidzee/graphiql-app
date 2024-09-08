'use client';

import { Box, Link } from '@chakra-ui/react';
import Image from 'next/image';
import styles from './styles.module.css';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

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
        <Box w="2px" h="30px" backgroundColor="rgb(58, 58, 58)" mr={30}></Box>
        <div className={styles.authors}>
          <div className={styles.authorsList}>
            <div className={styles.authorLinkWrapper}>
              <Link as={NextLink} href="https://github.com/AigerimR" isExternal>
                aigerimr <ExternalLinkIcon boxSize={3.5} mb={0.5} />
              </Link>
            </div>
            <div className={styles.authorLinkWrapper}>
              <Link
                as={NextLink}
                href="https://github.com/samekeekz"
                isExternal
              >
                samekeekz <ExternalLinkIcon boxSize={3.5} mb={0.5} />
              </Link>
            </div>
            <div className={styles.authorLinkWrapper}>
              <Link
                as={NextLink}
                href="https://github.com/Donchidzee"
                isExternal
              >
                donchidzee <ExternalLinkIcon boxSize={3.5} mb={0.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
