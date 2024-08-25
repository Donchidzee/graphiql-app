import React from 'react';
import styles from './footer.module.scss';
import { Link, Stack } from '@chakra-ui/react';

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
        <p>LOGO</p>
      </Stack>
    </div>
  );
};

export default Footer;
