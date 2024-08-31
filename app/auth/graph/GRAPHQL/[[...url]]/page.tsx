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
} from '@chakra-ui/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Graphql() {
  const { url } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stateUrl = useAppSelector((state) => state.restInputs.url);
  const stateBody = useAppSelector((state) => state.restInputs.body);

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

  const handleSubmit = async () => {
    try {
      const queryResponse = await fetch(stateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    }
  };

  const handleVariablesChange = (variables: object) => {
    setVariablesJson(variables);
  };

  return (
    <Flex direction="column" align="center" p={5}>
      <Box
        w="full"
        maxW="1200px"
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
        align={'flex-start'}
        w="full"
        h="full"
        maxW="1200px"
        mt={5}
      >
        <Box
          w={['full', '50%']}
          h="100%"
          borderWidth="1px"
          borderRadius="lg"
          borderColor={'gray.500'}
          overflow="hidden"
          p={5}
          boxShadow="md"
          mr={[0, 2]} // margin between boxes
          mb={[5, 0]} // margin bottom for mobile view
        >
          <Heading size="md" mb={4}>
            Query
          </Heading>
          <BodyInput />
        </Box>

        <Flex justify="center">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSubmit}
            boxShadow="lg"
          >
            Run Query
          </Button>
        </Flex>

        <Box
          w={['full', '50%']}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={'gray.500'}
          overflow="hidden"
          p={5}
          boxShadow="md"
          ml={[0, 2]} // margin between boxes
        >
          <Heading size="md" mb={4}>
            Response
          </Heading>
          <Input
            placeholder="HTTP Status Code"
            readOnly
            value={!!statusCode ? statusCode : ''}
            mb={4}
          />
          <Textarea
            placeholder="Response Body (Read-Only)"
            readOnly
            value={!!responseBody ? responseBody : ''}
            rows={10}
          />
        </Box>
      </Flex>

      {/* Tabs for Headers and Variables */}
      <Box
        w="full"
        maxW="1200px"
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
              >
                + Add Header
              </Button>
              <Box borderWidth="1px" borderRadius="md" p={2} width="full">
                <Flex justify="space-between" gap={2}>
                  <Box w="50%">
                    <Input placeholder="Header Key" />
                  </Box>
                  <Box w="50%">
                    <Input placeholder="Header Value" />
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box
        w="full"
        maxW="1200px"
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
