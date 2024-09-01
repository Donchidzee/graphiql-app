'use client';

import BodyInput from '@/components/graphql/BodyInput';
import Documentation from '@/components/graphql/Documentation';
import { Schema } from '@/components/graphql/Documentation/Documentation';
import VariablesEditor from '@/components/graphql/VariablesEditor';
import UrlInput from '@/components/rest/urlInput/UrlInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Flex,
  Box,
  Heading,
  Stack,
  Input,
  Button,
  Textarea,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Graphql() {
  const { url } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stateUrl = useAppSelector((state) => state.restInputs.url);
  const stateBody = useAppSelector((state) => state.restInputs.body);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //response content
  const [statusCode, setStatusCode] = useState<number>(0);
  const [responseBody, setResponseBody] = useState<string>('');
  const [documentation, setDocumentation] = useState<Schema>();
  const [variablesJson, setVariablesJson] = useState({});
  const [documentationLoading, setDocumentationLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const encodedNewUrl = btoa(encodeURIComponent(stateUrl));
    const pathArray = pathname.split('/');
    pathArray[4] = encodedNewUrl;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [stateUrl, router, pathname]);

  useEffect(() => {
    const encodedNewBody = btoa(encodeURIComponent(stateBody));
    const pathArray = pathname.split('/');
    pathArray[5] = encodedNewBody;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [stateBody, router, pathname]);

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
      const queryResponse = await fetch(stateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...formattedHeaders,
        },
        body: JSON.stringify({
          query: stateBody,
          variables: variablesJson,
        }),
      });

      setStatusCode(queryResponse.status);
      const queryResult = await queryResponse.json();
      setResponseBody(JSON.stringify(queryResult, null, 2));

      const schemaResponse = await fetch(stateUrl, {
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
    <Flex direction="column" align="center" p={5}>
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

      {/* Flex container for Query Editor and Response */}
      <Flex
        direction={['column', 'row']}
        justify="space-between"
        align="flex-start"
        w="full"
        h="500px" // Fixed height for the parent container
        maxW="1400px"
        mt={5}
        boxSizing="border-box" // Ensure padding is included in the height
      >
        <Box
          w={['full', '50%']}
          h="100%"
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.500"
          overflow="hidden"
          boxShadow="md"
          mr={[0, 2]} // margin between boxes
          mb={[5, 0]} // margin bottom for mobile view
          p={5}
          display="flex" // Use flexbox for children
          flexDirection="column" // Make children stack vertically
        >
          <Heading size="md" mb={4}>
            Query
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
            {isLoading ? 'Loading...' : 'Run Query'}
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
          ml={[0, 2]} // margin between boxes
          p={5}
          display="flex" // Use flexbox for children
          flexDirection="column" // Make children stack vertically
        >
          <Heading size="md" mb={4}>
            Response
          </Heading>
          <Input
            placeholder="HTTP Status Code"
            readOnly
            value={!!statusCode ? statusCode : ''}
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
              value={!!responseBody ? responseBody : ''}
              bg="gray.800" // Dark background
              color="white" // Light text color
              fontFamily="'Source Code Pro', monospace" // Monospace font for code
              fontSize="sm" // Adjust font size for code readability
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

      {/* Tabs for Headers and Variables */}
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
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Variables</Tab>
            <Tab>Headers</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VariablesEditor
                variablesJson={variablesJson}
                setVariablesJson={handleVariablesChange}
              />
            </TabPanel>
            <TabPanel>
              <Button
                colorScheme="teal"
                size="sm"
                textTransform="uppercase"
                width="100px"
                onClick={addHeader}
              >
                + Add Header
              </Button>
              {headers.map((header, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  width="full"
                  mt={2}
                  borderColor={index % 2 === 0 ? 'teal.500' : 'blue.500'} // Example: alternate between teal and blue
                >
                  <Flex justify="space-between" gap={2} alignItems="center">
                    <Box w="full">
                      <Input
                        placeholder="Header Key"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(index, 'key', e.target.value)
                        }
                      />
                    </Box>
                    <Box w="full">
                      <Input
                        placeholder="Header Value"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(index, 'value', e.target.value)
                        }
                      />
                    </Box>
                    <IconButton
                      aria-label="Remove header"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeHeader(index)}
                    />
                  </Flex>
                </Box>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
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
        <Heading size="md">Documentation</Heading>
        {documentationLoading ? (
          <p>Loading documentation...</p>
        ) : (
          <Documentation schema={documentation} />
        )}
      </Box>
    </Flex>
  );
}
