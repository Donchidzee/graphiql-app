import React from 'react';
import styles from './footer.module.scss';
import { Link, Stack } from '@chakra-ui/react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <Stack align="center" direction="row" justify="center">
        <Link
          href="https://github.com/Donchidzee/graphiql-app"
          color="blue.400"
          _hover={{ color: 'blue.500' }}
        >
          GithubLink
        </Link>
        <p>2024</p>
        <Image src="/images/alien.png" alt="alien" width={30} height={30} />
      </Stack>
    </div>
  );
};

export default Footer;
