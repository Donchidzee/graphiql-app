'use client';

import { RootState } from '@/store/store';
import { Box, Heading, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { LinkInter } from '../../../../routing';
import { useTranslations } from 'next-intl';

export default function History() {
  const t = useTranslations();

  const requestHistory = useSelector(
    (state: RootState) => state.restInputs.RequestHistory
  );

  return (
    <>
      <Heading
        as="h1"
        size="xl"
        noOfLines={1}
        textTransform="uppercase"
        textAlign="center"
      >
        {t('history')}
      </Heading>
      <>
        {requestHistory.length === 0 && (
          <Heading as="h2" size="md" noOfLines={1} textAlign="center" mt={10}>
            {t('noHistory')}
          </Heading>
        )}
        <Stack align="center" justify="center" direction="row" my={30} spacing={30}>
          <Link
            as={LinkInter}
            href="/api/rest/GET"
            color="blue.400"
            _hover={{ color: 'blue.500' }}
          >
            REST
          </Link>
          <Link 
            as={LinkInter}
            href="/api/graph/GRAPHQL"
            color="blue.400"
            _hover={{ color: 'blue.500' }}  
          >
            GRAPHGL
          </Link>
        </Stack>
      </>
      {requestHistory.length > 0 &&
        (<VStack spacing={3} align="stretch">
          {requestHistory.map((request, index) => (
            <Stack key={index} align="center" direction="row">
              <Link
                as={LinkInter}
                isExternal
                href={request.endpoint}
                color="blue.400"
                _hover={{ color: 'blue.500' }}
              >
                {t('request')} #{index + 1}
              </Link>
              <Box maxWidth="500px">
                <Text isTruncated>{request.endpoint}</Text>
              </Box>
            </Stack>
          )) }
        </VStack>)
      }
    </>
  );
}
