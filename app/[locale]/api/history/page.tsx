'use client';

import { Box, Heading, Stack, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import useAuthCheck from '../../../hooks/useAuthCheck';
import React, { useEffect, useState } from 'react';
import { LinkInter } from '../../../../routing';
import { Link } from '@chakra-ui/next-js';
import { RequestHistory } from '@/types/restTypes';

export default function History() {
  const t = useTranslations();

  useAuthCheck();
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);

  const fetchRequestHistory = () => {
    const history = localStorage.getItem('requestHistory');
    setRequestHistory(history ? JSON.parse(history) : []);
  };

  useEffect(() => {
    fetchRequestHistory();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'requestHistory') {
        fetchRequestHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [graphqlHistory, setGraphqlHistory] = useState([]);

  useEffect(() => {
    const lsStoredGraphqlHistory = localStorage.getItem(
      'graphqlRequestHistory'
    );
    const storedGraphqlRequests = lsStoredGraphqlHistory
      ? JSON.parse(lsStoredGraphqlHistory)
      : [];
    setGraphqlHistory(storedGraphqlRequests);
  }, []);

  return (
    <>
      <Heading
        as="h1"
        size="xl"
        noOfLines={1}
        textTransform="uppercase"
        textAlign="center"
        mb={8}
      >
        {t('history')}
      </Heading>

      {requestHistory.length === 0 && graphqlHistory.length === 0 && (
        <Heading as="h2" size="md" noOfLines={1} textAlign="center" mt={10}>
          {t('noHistory')}
        </Heading>
      )}

      <HStack spacing={10} align="start" justify="center" my={10}>
        <VStack spacing={4} align="start" flex={1}>
          <Heading as="h3" size="lg" textAlign="center" mx={'auto'}>
            <Link
              as={LinkInter}
              href="/api/rest/GET"
              color="teal"
              _hover={{ color: 'teal.500' }}
            >
              REST
            </Link>
          </Heading>
          {requestHistory.length > 0 &&
            requestHistory.map((request, index) => (
              <Stack key={index} align="start" direction="row" spacing={3}>
                <Link
                  as={LinkInter}
                  isExternal
                  href={request.endpoint || '#'}
                  color="blue.400"
                  _hover={{ color: 'blue.500' }}
                >
                  {t('request')} #{index + 1}
                </Link>
                <Box maxWidth="200px">
                  <Text isTruncated>{request.endpoint || 'N/A'}</Text>
                </Box>
              </Stack>
            ))}
        </VStack>

        <VStack spacing={4} align="start" flex={1}>
          <Heading as="h3" size="lg" textAlign="center" mx={'auto'}>
            <Link
              as={LinkInter}
              href="/api/graph/GRAPHQL"
              color="teal"
              _hover={{ color: 'teal.500' }}
            >
              GRAPHGL
            </Link>
          </Heading>
          {graphqlHistory.length > 0 &&
            graphqlHistory.map((request, index) => (
              <Stack key={index} align="start" direction="row" spacing={3}>
                <Link
                  as={LinkInter}
                  isExternal
                  href={request.endpoint || '#'}
                  color="blue.400"
                  _hover={{ color: 'blue.500' }}
                >
                  {t('request')} #{index + 1}
                </Link>
                <Box maxWidth="200px">
                  <Text isTruncated>{request.endpoint || 'N/A'}</Text>
                </Box>
              </Stack>
            ))}
        </VStack>
      </HStack>
    </>
  );
}
