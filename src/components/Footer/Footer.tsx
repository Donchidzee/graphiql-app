import React from 'react';
import styles from './footer.module.scss';
import { Link, Stack } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <Stack align="center" direction="row">
        <Link href="/auth/rest" color="blue.400" _hover={{ color: 'blue.500' }}>
          REST
        </Link>
        <p>2024</p>
        <p>LOGO</p>
        <Link href="/auth/rest" color="blue.400" _hover={{ color: 'blue.500' }}>
          REST
        </Link>
      </Stack>
    </div>
  );
};

export default Footer;
