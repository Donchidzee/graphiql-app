'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';

// import styles from "./page.module.scss";
interface ResponseValue {
  data?: string;
  status?: number;
  // headers?: Headers;
  headers?: string;
}

export default function Rest() {
  const router = useRouter();
  const pathname = usePathname();
  const { method, url } = useParams();

  const methods = useMemo(
    () => ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'],
    []
  );
  const methodOptions = methods.map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ));

  const [urlValue, setUrlValue] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('get');
  const [headers, setHeaders] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);
  const [bodyTextValue, setBodyTextValue] = useState('');
  const [bodyJsonValue, setBodyJsonValue] = useState('');
  const [responseValue, setresponseValue] = useState<ResponseValue>({});
  // const [responseValue, setresponseValue] = useState<string | null>(null);

  useEffect(() => {
    const currentMethod = method as string;
    const currentUrl = url ? atob(decodeURIComponent(url[0])) : undefined; //atob(url[0])

    if (currentMethod === undefined) {
      router.push('/auth/rest/GET');
    } else if (!methods.includes(currentMethod.toLowerCase())) {
      router.push('/404');
    } else {
      setSelectedMethod(currentMethod.toLowerCase());
      if (currentUrl === undefined) {
        router.push(`/auth/rest/${currentMethod}`);
      } else {
        setUrlValue(currentUrl);
      }
    }
  }, [method, router, url, methods]);

  const changeMethod = (e: { target: { value: string } }) => {
    const newMethod = e.target.value.toUpperCase();
    const pathArray = pathname.split('/');

    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    if (methodIndex !== -1) {
      pathArray[methodIndex] = newMethod;
    } else {
      pathArray.push(newMethod);
    }
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  };

  const handleUrlChange = (e: { target: { value: string } }) => {
    const newUrl = e.target.value;
    const encodedNewUrl = btoa(newUrl);
    // console.log(encodedNewUrl);

    setUrlValue(newUrl);

    const pathArray = pathname.split('/');

    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 1] = encodedNewUrl; //newUrl;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  };

  const addHeader = () => {
    setHeaders([
      ...headers,
      { headerIndex: headers.length, key: '', value: '' },
    ]);
  };

  const handleHeadersChange =
    (index: number, field: 'key' | 'value') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams();

      const newHeaders = [...headers];
      //add when will be encoding
      // if(field === "value") {
      //   newHeaders[index][field] = atob(e.target.value);
      // } else {
      //   newHeaders[index][field] = e.target.value;
      // }
      newHeaders[index][field] = e.target.value;
      setHeaders(newHeaders);
      newHeaders.forEach((header) => {
        if (header.key.trim() !== '') {
          params.set(header.key, header.value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    };

  const handleBodyTextChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (text !== '') {
      setBodyJsonValue(JSON.stringify(JSON.parse(text), null, 6));
    }
  };
  const handleBodyJsonChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (text !== '') {
      setBodyTextValue(JSON.stringify(JSON.parse(text)));
    }
  };

  const handleSendRequest = async () => {
    console.log(headers);

    if (urlValue) {
      // console.log(urlValue);
      // https://api.artic.edu/api/v1/artworks
      try {
        const response = await fetch(urlValue, {
          method: selectedMethod,
        });
        // const responseText = await response.text();
        ///saving headers
        const responseHeaders = headers.reduce((acc, obj) => {
          acc[obj.key] = obj.value;
          return acc;
        }, {});

        if (!response.ok) {
          console.log(typeof response.headers);
          const responseObject = {
            status: response.status,
            // headers: response.headers
            headers: JSON.stringify(responseHeaders, null, 2),
          };
          setresponseValue(responseObject);
          console.log(responseObject);

          throw new Error('Response was not ok');
        }
        // const result = await response.json();
        // const result = await response.text();
        const json = await response.json();
        const result = JSON.stringify(json, null, 2);
        // console.log(result);
        // console.log(response);
        const responseObject = {
          status: response.status,
          // headers: response.headers,
          headers: JSON.stringify(responseHeaders, null, 2),
          data: result,
        };

        setresponseValue(responseObject);
        // console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <VStack spacing={50} align="stretch">
        <Heading
          as="h1"
          size="xl"
          noOfLines={1}
          textTransform="uppercase"
          textAlign="center"
        >
          rest page
        </Heading>

        <VStack spacing={25} align="stretch">
          <Stack align="center" direction="row">
            <Heading
              as="h2"
              size="lg"
              noOfLines={1}
              textTransform="uppercase"
              bg="teal.400"
              width="100%"
            >
              request
            </Heading>
            <Button
              colorScheme="teal"
              size="md"
              textTransform="uppercase"
              width="100px"
              onClick={handleSendRequest}
            >
              send
            </Button>
          </Stack>
          <Stack align="center" direction="row">
            <Select
              value={selectedMethod}
              textTransform="uppercase"
              width="200px"
              onChange={changeMethod}
            >
              {methodOptions}
            </Select>
            <InputGroup size="md">
              <InputLeftAddon>url</InputLeftAddon>
              <Input
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onBlur={handleUrlChange}
              />
            </InputGroup>
          </Stack>
          <VStack spacing={2} align="stretch">
            <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
              body
            </Heading>
            <Tabs width="100%">
              <TabList>
                <Tab>Text</Tab>
                <Tab>JSON</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Textarea
                    as={TextareaAutosize}
                    minHeight="120px"
                    height="auto"
                    value={bodyTextValue}
                    placeholder="body text"
                    onChange={(e) => setBodyTextValue(e.target.value)}
                    onBlur={handleBodyTextChange}
                  />
                </TabPanel>
                <TabPanel>
                  <Textarea
                    as={TextareaAutosize}
                    minHeight="120px"
                    height="100%"
                    value={bodyJsonValue}
                    placeholder="body json"
                    onChange={(e) => setBodyJsonValue(e.target.value)}
                    onBlur={handleBodyJsonChange}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
          {/* Variables section that can shown or hidden, specified variables are included in the body */}

          <VStack spacing={2} align="stretch">
            <Stack align="center" direction="row">
              <Heading
                as="h2"
                size="sm"
                noOfLines={1}
                textTransform="uppercase"
              >
                headers
              </Heading>
              <Button
                colorScheme="teal"
                size="sm"
                textTransform="uppercase"
                width="100px"
                onClick={addHeader}
              >
                new header
              </Button>
            </Stack>
            {headers.map((header, index) => (
              <Stack key={index} align="center" direction="row">
                <InputGroup size="md">
                  <InputLeftAddon>key</InputLeftAddon>
                  <Input
                    value={header.key}
                    onChange={handleHeadersChange(index, 'key')}
                  />
                </InputGroup>
                <InputGroup size="md">
                  <InputLeftAddon>value</InputLeftAddon>
                  <Input
                    value={header.value}
                    onChange={handleHeadersChange(index, 'value')}
                  />
                </InputGroup>
                {/* <Button colorScheme='teal' size='sm' textTransform="uppercase">add</Button> */}
              </Stack>
            ))}
          </VStack>
        </VStack>
        <VStack spacing={25} align="stretch">
          <Heading
            as="h2"
            size="lg"
            noOfLines={1}
            textTransform="uppercase"
            bg="teal.400"
          >
            response
          </Heading>
          <Tabs width="100%">
            <TabList>
              <Tab textTransform="uppercase">status</Tab>
              <Tab textTransform="uppercase">body</Tab>
              <Tab textTransform="uppercase">headers</Tab>
            </TabList>
            <TabPanels>
              <TabPanel color="blue.600">
                <p>
                  {responseValue.status !== undefined
                    ? responseValue.status
                    : ''}
                </p>
              </TabPanel>
              <TabPanel>
                <Textarea
                  as={TextareaAutosize}
                  maxHeight="50vh"
                  isDisabled
                  placeholder={
                    responseValue.data !== undefined ? responseValue.data : ''
                  }
                  size="sm"
                  sx={{
                    ':disabled': {
                      opacity: 0.8,
                    },
                    '::placeholder': {
                      color: 'blue.600',
                    },
                  }}
                />
              </TabPanel>
              <TabPanel>
                <Textarea
                  as={TextareaAutosize}
                  maxHeight="50vh"
                  isDisabled
                  // placeholder={responseValue.headers !== undefined ? JSON.stringify(Object.fromEntries(responseValue.headers.entries()), null, 2) : ''}
                  placeholder={
                    responseValue.headers !== undefined
                      ? responseValue.headers
                      : ''
                  }
                  size="sm"
                  sx={{
                    ':disabled': {
                      opacity: 0.8,
                    },
                    '::placeholder': {
                      color: 'blue.600',
                    },
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </VStack>
    </>
  );
}
