'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BodyInput from '@/components/graphql/BodyInput';
import { useAppSelector } from '@/store/hooks';
import Documentation, {
  Schema,
} from '@/components/graphql/Documentation/Documentation';
import UrlInput from '@/components/rest/urlInput/UrlInput';
import { useTranslations } from 'next-intl';
import StyledTabs from '@/components/StyledTabs';
import useDebounce from '@/helpers/useDebounce';

export default function Graphql() {
  const pathname = usePathname();
  const router = useRouter();
  const stateUrl = useAppSelector((state) => state.restInputs.url);
  const stateBody = useAppSelector((state) => state.restInputs.body);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations();
  //response content
  const [statusCode, setStatusCode] = useState<number>(0);
  const [responseBody, setResponseBody] = useState<string>('');
  const [documentation, setDocumentation] = useState<Schema>();
  const [variablesJson, setVariablesJson] = useState({});
  const [documentationLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce values
  const debouncedUrl = useDebounce(stateUrl, 500);
  const debouncedBody = useDebounce(stateBody, 500);

  useEffect(() => {
    const encodedNewUrl = btoa(encodeURIComponent(debouncedUrl));
    const pathArray = pathname.split('/');
    pathArray[5] = encodedNewUrl;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [debouncedUrl, router, pathname]);

  useEffect(() => {
    const encodedNewBody = btoa(encodeURIComponent(debouncedBody));
    const pathArray = pathname.split('/');
    pathArray[6] = encodedNewBody;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [debouncedBody, router, pathname]);

  useEffect(() => {
    console.log(variablesJson);
  }, [variablesJson]);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index, type, value) => {
    const newHeaders = headers.map((header, i) =>
      i === index ? { ...header, [type]: value } : header
    );
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleSubmit = async () => {
    const formattedHeaders = headers.reduce((acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    try {
      setIsLoading(true);
      const queryResponse = await fetch(debouncedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...formattedHeaders,
        },
        body: JSON.stringify({
          query: debouncedBody,
          variables: variablesJson,
        }),
      });

      setStatusCode(queryResponse.status);
      const queryResult = await queryResponse.json();
      setResponseBody(JSON.stringify(queryResult, null, 2));

      const schemaResponse = await fetch(debouncedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          query IntrospectionQuery {
            __schema {
              queryType { name }
              mutationType { name }
              subscriptionType { name }
              types {
                ...FullType
              }
              directives {
                name
                description
                locations
                args {
                  ...InputValue
                }
              }
            }
          }

          fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
              name
              description
              args {
                ...InputValue
              }
              type {
                ...TypeRef
              }
              isDeprecated
              deprecationReason
            }
            inputFields {
              ...InputValue
            }
            interfaces {
              ...TypeRef
            }
          }

          fragment InputValue on __InputValue {
            name
            description
            type { ...TypeRef }
            defaultValue
          }

          fragment TypeRef on __Type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        }),
      });

      const schemaResult = await schemaResponse.json();
      setDocumentation(schemaResult.data.__schema);
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariablesChange = (variables: object) => {
    setVariablesJson(variables);
  };

  return (
    <Flex direction="column" align="center" p={5} ref={containerRef}>
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
        <Heading size="md" mb={4} textAlign="center">
          GraphiQL Client
        </Heading>

        <Stack spacing={4} align="center">
          <Flex direction="column" width="full" maxW="600px" align="center">
            <UrlInput />
          </Flex>
        </Stack>
      </Box>

      <Flex
        direction={['column', 'row']}
        justify="space-between"
        align="flex-start"
        w="full"
        h="500px"
        maxW="1400px"
        mt={5}
        boxSizing="border-box"
      >
        <Box
          w={['full', '50%']}
          h="100%"
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.500"
          overflow="hidden"
          boxShadow="md"
          mr={[0, 2]}
          mb={[5, 0]}
          p={5}
          display="flex"
          flexDirection="column"
        >
          <Heading size="md" mb={4}>
            {t('query')}
          </Heading>
          <Box flex="1">
            <BodyInput />
          </Box>
        </Box>

        <Flex justify="center">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSubmit}
            boxShadow="lg"
          >
            {isLoading ? t('loading') : t('run')}
          </Button>
        </Flex>

        <Box
          w={['full', '50%']}
          h="100%"
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.500"
          overflow="hidden"
          boxShadow="md"
          ml={[0, 2]}
          p={5}
          display="flex"
          flexDirection="column"
        >
          <Heading size="md" mb={4}>
            {t('response')}
          </Heading>
          <Input
            placeholder="HTTP Status Code"
            readOnly
            value={statusCode ? statusCode : ''}
            mb={4}
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
          <Box flex="1">
            <Textarea
              placeholder="Response Body (Read-Only)"
              readOnly
              height="100%"
              value={responseBody ? responseBody : ''}
              bg="gray.800" // Dark background
              color="white" // Light text color
              fontFamily="'Source Code Pro', monospace" // Monospace font for code
              fontSize="14px" // Adjust font size for code readability
              p={4} // Padding for better spacing
              borderRadius="md" // Rounded corners
              borderColor="gray.600" // Border color
              borderWidth="1px" // Border width
              _focus={{ borderColor: 'blue.500' }} // Border color on focus
              resize="none"
            />
          </Box>
        </Box>
      </Flex>

      <Box
        w="full"
        maxW="1400px"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={'gray.500'}
        overflow="hidden"
        p={5}
        boxShadow="md"
        mt={5}
      >
        <StyledTabs
          variablesJson={variablesJson}
          handleVariablesChange={handleVariablesChange}
          headers={headers}
          updateHeader={updateHeader}
          removeHeader={removeHeader}
          addHeader={addHeader}
        />
      </Box>

      <Box
        w="full"
        maxW="1400px"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={'gray.500'}
        overflow="hidden"
        p={5}
        boxShadow="md"
        mt={5}
      >
        <Heading size="md"> {t('documentation')}</Heading>
        {documentationLoading ? (
          <p>Loading documentation...</p>
        ) : (
          <Documentation schema={documentation} />
        )}
      </Box>
    </Flex>
  );
}
