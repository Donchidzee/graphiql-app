'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  FormControl,
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
import {
  changeBody,
  changeUrl,
  changeUrlError,
} from '@/store/slices/restInputsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UrlInput from '@/components/rest/urlInput/UrlInput';
import BodyInput from '@/components/rest/bodyInput.tsx/BodyInput';

// import styles from "./page.module.scss";
interface ResponseValue {
  data?: string;
  status?: string;
  headers?: Headers;
}

export default function Rest() {
  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateBody = useSelector((state: RootState) => state.restInputs.body);

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

  const [selectedMethod, setSelectedMethod] = useState('get');
  const [headers, setHeaders] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);
  const [variables, setVariables] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);
  // const [bodyTextValue, setBodyTextValue] = useState('');
  // const [bodyJsonValue, setBodyJsonValue] = useState('');
  const [responseValue, setResponseValue] = useState<ResponseValue>({});
  // const [responseValue, setresponseValue] = useState<string | null>(null);
  // const [bodyError, setBodyError] = useState(false);
  const [headerInputErrors, setHeaderInputErrors] = useState(
    headers.map(() => ({ key: false, value: false }))
  );

  useEffect(() => {
    localStorage.setItem('localVariables', JSON.stringify(variables));
  }, [variables]);
  useEffect(() => {
    const currentMethod = method as string;
    const currentUrl = url
      ? decodeURIComponent(atob(decodeURIComponent(url[0])))
      : undefined;
    const currentBody =
      url && url[1]
        ? decodeURIComponent(atob(decodeURIComponent(url[1])))
        : undefined;
    // console.log(currentBody);

    if (currentMethod === undefined) {
      router.push('/auth/rest/GET');
    } else if (!methods.includes(currentMethod.toLowerCase())) {
      router.push('/404');
    } else {
      setSelectedMethod(currentMethod.toLowerCase());
      if (currentUrl === undefined) {
        router.push(`/auth/rest/${currentMethod}`);
      } else {
        dispatch(changeUrl(currentUrl));
        if (currentBody) {
          dispatch(changeBody(currentBody));
        }
      }
    }
  }, [method, router, url, methods, dispatch]);

  useEffect(() => {
    const encodedNewUrl = btoa(encodeURIComponent(stateUrl));

    const pathArray = pathname.split('/');

    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 1] = encodedNewUrl;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [stateUrl, methods, router, pathname]);

  useEffect(() => {
    const encodedNewBody = btoa(encodeURIComponent(stateBody));

    const pathArray = pathname.split('/');
    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 2] = encodedNewBody;
    const newPath = `${pathArray.join('/')}`;
    router.replace(newPath);
  }, [stateBody, methods, router, pathname]);

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

  const addHeader = () => {
    setHeaders([
      ...headers,
      { headerIndex: headers.length, key: '', value: '' },
    ]);
    setHeaderInputErrors([...headerInputErrors, { key: false, value: false }]);
  };
  const isValidHeaderInput = (str) => {
    /* eslint-disable no-control-regex */
    return /^[\x00-\xFF]*$/.test(str);
  };
  const handleHeadersChange =
    (index: number, field: 'key' | 'value') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams();

      const newHeaders = [...headers];
      newHeaders[index][field] = e.target.value;
      setHeaders(newHeaders);
      newHeaders.forEach((header) => {
        if (header.key.trim() !== '') {
          const encodedHeaderValue = btoa(encodeURIComponent(header.value));
          params.set(header.key, encodedHeaderValue);
        }
      });
      router.replace(`${pathname}?${params.toString()}`);

      const newHeaderInputErrors = [...headerInputErrors];
      if (!newHeaderInputErrors[index]) {
        newHeaderInputErrors[index] = { key: false, value: false };
      }
      newHeaderInputErrors[index][field] = !isValidHeaderInput(e.target.value);
      setHeaderInputErrors(newHeaderInputErrors);
    };

  // const replaceVariable = (str) => {
  //   const LSVariables = JSON.parse(localStorage.getItem('localVariables'));

  //   return str.replace(
  //     /"{{(.*?)}}"|{{(.*?)}}/g,
  //     (_, quotedKey, unquotedKey) => {
  //       const key = quotedKey || unquotedKey;
  //       const variable = LSVariables.find((el) => el.key === key);
  //       return variable ? `"{{${key}}}"` : key;
  //     }
  //   );
  // };

  // const changeBodyText = (e: { target: { value: string } }) => {
  //   const text = e.target.value;
  //   setBodyTextValue(text);

  //   if (text !== '') {
  //     try {
  //       const replacedVariablesText = replaceVariable(text);
  //       setBodyJsonValue(
  //         JSON.stringify(JSON.parse(replacedVariablesText), null, 6)
  //       );
  //       setBodyError(false);
  //     } catch {
  //       setBodyJsonValue(text);
  //       setBodyError(true);
  //     }
  //   }
  // };

  // const changeBodyJson = (e: { target: { value: string } }) => {
  //   const text = e.target.value;
  //   setBodyJsonValue(text);
  //   if (text !== '') {
  //     try {
  //       const replacedVariablesText = replaceVariable(text);
  //       setBodyTextValue(text);
  //       setBodyJsonValue(
  //         JSON.stringify(JSON.parse(replacedVariablesText), null, 6)
  //       );
  //       setBodyError(false);
  //     } catch {
  //       setBodyJsonValue(text);
  //       setBodyTextValue(text);
  //       setBodyError(true);
  //     }
  //   }
  // };
  // const handleBodyTextChange = (e: { target: { value: string } }) => {
  //   const text = e.target.value;

  //   console.log('write body into url in base 64');

  //   if (stateUrl === '') {
  //     dispatch(changeUrlError(true));
  //   } else {
  //     dispatch(changeUrlError(false));

  //     const encodedNewBody = btoa(encodeURIComponent(text));

  //     const pathArray = pathname.split('/');
  //     const methodIndex = pathArray.findIndex((el) =>
  //       methods.includes(el.toLowerCase())
  //     );
  //     pathArray[methodIndex + 2] = encodedNewBody;
  //     const newPath = `${pathArray.join('/')}`;
  //     router.replace(newPath);
  //   }
  // };
  // const handleBodyJsonChange = (e: { target: { value: string } }) => {
  //   console.log('write body into url in base 64', e);
  // };

  const handleSendRequest = async () => {
    if (stateUrl) {
      // https://api.artic.edu/api/v1/artworks
      ///saving headers
      const responseHeaders = headers.reduce((acc, obj) => {
        acc[obj.key] = obj.value;
        return acc;
      }, {});

      try {
        const response = await fetch(stateUrl, {
          method: selectedMethod,
          headers: responseHeaders,
        });

        if (!response.ok) {
          const responseObject = {
            status: response.status.toString(),
            headers: response.headers,
          };
          setResponseValue(responseObject);

          throw new Error('Response was not ok');
        }

        const json = await response.json();
        const result = JSON.stringify(json, null, 2);
        const responseObject = {
          status: response.status.toString(),
          headers: response.headers,
          data: result,
        };

        setResponseValue(responseObject);
      } catch (error) {
        let responseObject;
        if (error.name === 'TypeError') {
          responseObject = {
            status: 'Error in headers',
          };
        } else {
          responseObject = {
            status: 'Could not send request',
          };
        }
        setResponseValue(responseObject);
      }
    } else {
      dispatch(changeUrlError(true));
    }
  };

  const addVariable = () => {
    setVariables([
      ...variables,
      { headerIndex: variables.length, key: '', value: '' },
    ]);
  };

  const handleVariablesChange =
    (index: number, field: 'key' | 'value') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariables = [...variables];
      newVariables[index][field] = e.target.value;
      setVariables(newVariables);
      localStorage.setItem('localVariables', JSON.stringify(variables));
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
            <UrlInput />
          </Stack>
          <VStack spacing={2} align="stretch">
            <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
              body
            </Heading>
            <BodyInput />
            {/* <Tabs width="100%">
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
                    onChange={changeBodyText}
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
                    onChange={changeBodyJson}
                    onBlur={handleBodyJsonChange}
                    sx={{
                      textDecoration: bodyError
                        ? '#E53E3E wavy underline'
                        : 'none',
                    }}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs> */}
          </VStack>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Heading
                      as="h2"
                      size="sm"
                      noOfLines={1}
                      textTransform="uppercase"
                    >
                      headers
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={8}>
                <VStack spacing={2} align="stretch">
                  <Button
                    colorScheme="teal"
                    size="sm"
                    textTransform="uppercase"
                    width="100px"
                    onClick={addHeader}
                  >
                    new header
                  </Button>
                  {headers.map((header, index) => (
                    <Stack key={index} align="center" direction="row">
                      <FormControl isInvalid={headerInputErrors[index]?.key}>
                        <InputGroup size="md">
                          <InputLeftAddon>key</InputLeftAddon>
                          <Input
                            value={header.key}
                            onChange={handleHeadersChange(index, 'key')}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl isInvalid={headerInputErrors[index]?.value}>
                        <InputGroup size="md">
                          <InputLeftAddon>value</InputLeftAddon>
                          <Input
                            value={header.value}
                            onChange={handleHeadersChange(index, 'value')}
                          />
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Heading
                      as="h2"
                      size="sm"
                      noOfLines={1}
                      textTransform="uppercase"
                    >
                      variables
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={8}>
                <VStack spacing={2} align="stretch">
                  <Button
                    colorScheme="teal"
                    size="sm"
                    textTransform="uppercase"
                    width="100px"
                    onClick={addVariable}
                  >
                    new variable
                  </Button>
                  {variables.map((variable, index) => (
                    <Stack key={index} align="center" direction="row">
                      <InputGroup size="md">
                        <InputLeftAddon>key</InputLeftAddon>
                        <Input
                          value={variable.key}
                          onChange={handleVariablesChange(index, 'key')}
                        />
                      </InputGroup>
                      <InputGroup size="md">
                        <InputLeftAddon>value</InputLeftAddon>
                        <Input
                          value={variable.value}
                          onChange={handleVariablesChange(index, 'value')}
                        />
                      </InputGroup>
                    </Stack>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
