import React from 'react';

import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { ResponseAreaProps } from '@/types/restTypes';
import { useTranslations } from 'next-intl';

const ResponseArea: React.FC<ResponseAreaProps> = ({ responseValue }) => {
  const t = useTranslations();

  return (
    <Box
      w="full"
      maxW="1400px"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={'gray.500'}
      overflow="hidden"
      p={5}
      boxShadow="md"
    >
      <Tabs width="100%">
        <TabList>
          <Tab textTransform="uppercase" color={'teal'}>
            {t('status')}
          </Tab>
          <Tab textTransform="uppercase" color={'teal'}>
            {t('body')}
          </Tab>
          <Tab textTransform="uppercase" color={'teal'}>
            {t('headers')}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            color="white"
            bg={'gray.800'}
            fontFamily="'Source Code Pro', monospace"
            fontSize="sm"
            p={4}
            mt={4}
            borderRadius="md"
            borderColor="gray.600"
            borderWidth="1px"
            _focus={{ borderColor: 'blue.500' }}
          >
            <p color={'white'}>
              {responseValue.status !== undefined ? responseValue.status : ''}
            </p>
          </TabPanel>
          <TabPanel px={0}>
            <Textarea
              as={TextareaAutosize}
              maxHeight="50vh"
              readOnly
              placeholder={
                responseValue.data !== undefined ? responseValue.data : ''
              }
              size="sm"
              sx={{
                ':disabled': {
                  opacity: 0.8,
                },
                '::placeholder': {
                  color: 'white',
                },
              }}
              bg={'gray.800'}
              color={'white'}
              fontFamily="'Source Code Pro', monospace"
              fontSize="sm"
              p={4}
              borderRadius="md"
              borderColor="gray.600"
              borderWidth="1px"
              _focus={{ borderColor: 'blue.500' }}
            />
          </TabPanel>
          <TabPanel px={0}>
            <Textarea
              as={TextareaAutosize}
              maxHeight="50vh"
              readOnly
              placeholder={
                responseValue.headers !== undefined
                  ? JSON.stringify(
                      Object.fromEntries(responseValue.headers.entries()),
                      null,
                      2
                    )
                  : ''
              }
              size="sm"
              sx={{
                ':disabled': {
                  opacity: 0.8,
                },
                '::placeholder': {
                  color: 'white',
                },
              }}
              bg={'gray.800'}
              color={'white'}
              fontFamily="'Source Code Pro', monospace"
              fontSize="sm"
              p={4}
              borderRadius="md"
              borderColor="gray.600"
              borderWidth="1px"
              _focus={{ borderColor: 'blue.500' }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ResponseArea;
