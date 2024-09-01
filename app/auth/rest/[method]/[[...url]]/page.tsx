'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button, Heading, Select, Stack, VStack, Text } from '@chakra-ui/react';
import {
  changeBody,
  changeUrl,
  changeUrlError,
} from '@/store/slices/restInputsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UrlInput from '@/components/rest/urlInput/UrlInput';
import BodyInput from '@/components/rest/bodyInput.tsx/BodyInput';
import VariablesInputs from '@/components/rest/variablesInputs/VariablesInputs';
import HeadersInputs from '@/components/rest/headersInputs/HeadersInputs';
import ResponseArea from '@/components/responseArea/ResponseArea';
import { ResponseValue } from '@/types/restTypes';

// import styles from "./page.module.scss";

export default function Rest() {
  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateBody = useSelector((state: RootState) => state.restInputs.body);
  const stateHeaders = useSelector(
    (state: RootState) => state.restInputs.headers
  );

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
  const [responseValue, setResponseValue] = useState<ResponseValue>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentMethod = method as string;
    const currentUrl = url
      ? decodeURIComponent(atob(decodeURIComponent(url[0])))
      : undefined;
    const currentBody =
      url && url[1]
        ? decodeURIComponent(atob(decodeURIComponent(url[1])))
        : undefined;

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

  const handleSendRequest = async () => {
    if (stateUrl) {
      setLoading(true);
      // https://api.artic.edu/api/v1/artworks
      const responseHeaders = stateHeaders.reduce((acc, obj) => {
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
      } catch {
        const responseObject = {
          status: 'Could not send request',
        };
        setResponseValue(responseObject);
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(changeUrlError(true));
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
            <UrlInput />
          </Stack>
          <VStack spacing={2} align="stretch">
            <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
              body
            </Heading>
            <BodyInput />
          </VStack>
          <HeadersInputs />
          <VariablesInputs />
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
            {loading && (
              <Text as="span" ml={40} fontSize="md">
                Waiting for response...
              </Text>
            )}
          </Heading>
          <ResponseArea responseValue={responseValue} />
        </VStack>
      </VStack>
    </>
  );
}
