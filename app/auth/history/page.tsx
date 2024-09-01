'use client';

import { RootState } from '@/store/store';
import { Box, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

export default function History() {
  const requestHistory = useSelector((state: RootState) => state.restInputs.RequestHistory);

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
      <>
        {requestHistory.length===0 && <Heading as="h2" size="md" noOfLines={1} textAlign="center">
          You have not executed any requests yet
        </Heading>}
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
      {requestHistory.length>0 &&
        requestHistory.map((request, index) => (
          <Stack key={index} align="center" direction="row">
            <Link
              isExternal
              href={request.endpoint}
              color="blue.400"
              _hover={{ color: 'blue.500' }}
            >
              reuest #{index + 1}
            </Link>
            <Box maxWidth="500px">
              <Text isTruncated>
                {request.endpoint}
              </Text>
            </Box>
         </Stack>
        ))
      }
    </>
  );
}
