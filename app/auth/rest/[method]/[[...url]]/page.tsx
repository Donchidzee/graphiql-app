'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
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

export default function Rest() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const currentMethod = method as string;
    const currentUrl = url ? url[0] : undefined; //atob(url[0])

    if (currentMethod === undefined) {
      router.push('/auth/rest/GET');
    } else if (!methods.includes(currentMethod.toLowerCase())) {
      router.push('/404');
    } else {
      setSelectedMethod(currentMethod.toLowerCase());
      console.log(currentUrl);

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
    console.log(encodedNewUrl);

    setUrlValue(newUrl);

    const pathArray = pathname.split('/');

    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 1] = newUrl; //encodedNewUrl
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
      // console.log(headers[index]);
      // console.log(searchParams);

      // const oldHeader = headers[index];
      // console.log(headers);

      const params = new URLSearchParams(searchParams.toString());

      if (field === 'key') {
        const oldKey = headers[index].key;
        if (oldKey) {
          console.log('old', oldKey);

          params.delete(oldKey);
        }
        params.append(e.target.value, headers[index].key);
      } else if (field === 'value') {
        // params.set(headers[index].key, e.target.value); // Update value of existing key
      }
      // console.log('params', params.get(field));
      const paramsObject = Object.fromEntries(searchParams.entries());
      console.log(paramsObject);

      // router.replace(`${window.location.pathname}?${params.toString()}`);
      const newHeaders = [...headers];
      newHeaders[index][field] = e.target.value;
      setHeaders(newHeaders);
      // console.log('headers', headers);
    };

  const handleBodyTextChange = (e: { target: { value: string } }) => {
    // setBodyTextValue(e.target.value)
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

  const handleSendRequest = () => {};

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

          {/* Headers section, value is provided in the url on header add/change */}
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
          <Stack align="center" direction="row">
            <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
              status
            </Heading>
            <p>Status code</p>
          </Stack>
          <VStack spacing={2} align="stretch">
            <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
              body
            </Heading>
            <Textarea
              isDisabled
              placeholder="Here is a readonly response with HTTP response code and the response status."
              size="sm"
            />
          </VStack>
        </VStack>
      </VStack>
    </>
  );
}
