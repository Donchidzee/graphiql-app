import { Heading, Link, Stack } from '@chakra-ui/react';

export default function Home() {
  const lsStoredRequestHistory = localStorage.getItem('requestHistory');
  const storedRequests = lsStoredRequestHistory
    ? JSON.parse(lsStoredRequestHistory)
    : [];

  return (
    <>
      <Heading
        as="h1"
        size="xl"
        noOfLines={1}
        textTransform="uppercase"
        textAlign="center"
      >
        History page
      </Heading>
      {!storedRequests && (
        <>
          <Heading as="h2" size="md" noOfLines={1} textAlign="center">
            You have not executed any requests yet
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
      )}
      {storedRequests &&
        storedRequests.map((request, index) => {
          if (request.type === 'rest') {
            <Link
              href="/auth/rest/"
              color="blue.400"
              _hover={{ color: 'blue.500' }}
            >
              reuest #{index + 1}
            </Link>;
          } else {
            ///link to graphql
          }
        })}
    </>
  );
}
