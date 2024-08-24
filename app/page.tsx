// import styles from './page.module.css';
import { Heading, Link, Stack } from '@chakra-ui/react';

export default function Home() {
  return (
    <>
      <Heading
        as="h1"
        size="xl"
        noOfLines={1}
        textTransform="uppercase"
        textAlign="center"
      >
        Home page
      </Heading>

      <Stack align="center" direction="row">
        <Link
          href="/auth/rest/GET"
          color="blue.400"
          _hover={{ color: 'blue.500' }}
        >
          REST
        </Link>
        <Link href="/auth/graph">GRAPHGL</Link>
      </Stack>
    </>
  );
}
