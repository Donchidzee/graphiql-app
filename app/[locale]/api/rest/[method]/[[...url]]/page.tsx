'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Button, Heading, Select, Stack, VStack, Text, Box } from '@chakra-ui/react';
import {
  changeBody,
  changeHeaders,
  changeUrl,
  changeUrlError,
} from '../../../../..//store/slices/restInputsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UrlInput from '../../../../../components/rest/urlInput/UrlInput';
import BodyInput from '../../../../../components/rest/bodyInput.tsx/BodyInput';
import VariablesInputs from '../../../../../components/rest/variablesInputs/VariablesInputs';
import HeadersInputs from '../../../../../components/rest/headersInputs/HeadersInputs';
import ResponseArea from '../../../../../components/rest/responseArea/ResponseArea';
import { ResponseValue } from '../../../../../../src/types/restTypes';
import {
  isBase64,
  saveEndpointToLS,
} from '../../../../../../src/helpers/helpers';
import { useTranslations } from 'next-intl';

export default function Rest() {
  const t = useTranslations();

  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateBody = useSelector((state: RootState) => state.restInputs.body);
  const stateHeaders = useSelector(
    (state: RootState) => state.restInputs.headers
  );

  const router = useRouter();
  const pathname = usePathname();
  const { method, url, locale } = useParams();
  const searchParams = useSearchParams();

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
  const [allowSend, setAllowSend] = useState(true);
  const bodyTextInputRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyJsonInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleBodyTextInputFocus = (isFocused) => {
    setAllowSend(!isFocused);
  };

  useEffect(() => {
    const currentMethod = method as string;
    const currentUrl =
      url && url[0] && isBase64(decodeURIComponent(url[0]))
        ? decodeURIComponent(atob(decodeURIComponent(url[0])))
        : undefined;

    const currentBody =
      url && url[1]
        ? decodeURIComponent(atob(decodeURIComponent(url[1])))
        : undefined;
    if (currentMethod === undefined) {
      router.push(`${locale}/api/rest/GET`);
    } else if (!methods.includes(currentMethod.toLowerCase())) {
      router.push('/404');
    } else {
      if (selectedMethod !== currentMethod.toLowerCase()) {
        setSelectedMethod(currentMethod.toLowerCase());
      }
      if (currentUrl !== undefined) {
        dispatch(changeUrl(currentUrl));
      } else {
        const pathArray = pathname.split('/');
        const methodIndex = pathArray.findIndex((el) =>
          methods.includes(el.toLowerCase())
        );
        if (methodIndex !== -1) {
          pathArray.splice(methodIndex + 1, 1);
          const newPath = `${pathArray.join('/')}?${searchParams.toString()}`;
          router.replace(newPath);
          dispatch(changeBody(''));
        }
      }

      if (currentBody) {
        dispatch(changeBody(currentBody));
      }
    }
  }, [method, router, url, methods, dispatch, locale, pathname, searchParams]);

  useEffect(() => {
    const encodedNewUrl = btoa(encodeURIComponent(stateUrl));

    const pathArray = pathname.split('/');

    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 1] = encodedNewUrl;
    const newPath = `${pathArray.join('/')}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newPath);
  }, [stateUrl, methods, router, pathname, searchParams]);

  useEffect(() => {
    const encodedNewBody = btoa(encodeURIComponent(stateBody));

    const pathArray = pathname.split('/');
    const methodIndex = pathArray.findIndex((el) =>
      methods.includes(el.toLowerCase())
    );
    pathArray[methodIndex + 2] = encodedNewBody;
    const newPath = `${pathArray.join('/')}?${searchParams.toString()}`;
    router.replace(newPath);
  }, [stateBody, methods, router, pathname, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    stateHeaders.forEach((header) => {
      const encodedHeaderValue = btoa(encodeURIComponent(header.value));
      params.set(header.key, encodedHeaderValue);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }, [stateHeaders, pathname, router]);

  useEffect(() => {
    if (searchParams) {
      const searchParamsArray = Array.from(searchParams.entries());
      const headersFromEndpoint = searchParamsArray.map((param, index) => {
        return {
          headerIndex: index,
          key: param[0],
          value: decodeURIComponent(atob(decodeURIComponent(param[1]))),
        };
      });
      dispatch(changeHeaders(headersFromEndpoint));
    }
  }, [searchParams, dispatch]);

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
    const newPath = `${pathArray.join('/')}?${searchParams.toString()}`;
    router.replace(newPath);
  };

  const handleSendRequest = async () => {
    if (stateUrl) {
      saveEndpointToLS(pathname, searchParams, dispatch);
      setLoading(true);
      const responseHeaders = stateHeaders.reduce((acc, obj) => {
        if (obj.key !== 'variables') {
          acc[obj.key] = obj.value;
        }
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
          status: t('responseNotOk'),
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
      <VStack 
        spacing={50} 
        align="stretch"    
        maxW="1400px"
        mx={'auto'}
      >
        <Heading
          as="h1"
          size="xl"
          noOfLines={1}
          textTransform="uppercase"
          textAlign="center"
        >
          {t('restfull')}
        </Heading>
        <VStack spacing={25} align="stretch">
          <Stack align="center" direction="row">
            <Heading
              as="h2"
              size="lg"
              noOfLines={1}
              textTransform="uppercase"
              width="100%"
              bg={'whiteAlpha.300'}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={'transparent'}
              pl={5}
            >
              {t('request')}
            </Heading>
            <Button
              colorScheme="gray"
              size="md"
              textTransform="uppercase"
              width="min-content"
              onClick={handleSendRequest}
              isDisabled={!allowSend || !stateUrl}
            >
              {t('send')}
            </Button>
          </Stack>
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
          >
            <VStack spacing={2} align="stretch">
              <Heading as="h2" size="sm" noOfLines={1} textTransform="uppercase">
                {t('body')}
              </Heading>
              <BodyInput
                bodyTextInputRef={bodyTextInputRef}
                bodyJsonInputRef={bodyJsonInputRef}
                handleBodyTextInputFocus={handleBodyTextInputFocus}
              />
            </VStack>
          </Box>
          <HeadersInputs />
          <VariablesInputs />
        </VStack>
        <VStack spacing={25} align="stretch">
          <Heading
            as="h2"
            size="lg"
            noOfLines={1}
            textTransform="uppercase"
            bg={'whiteAlpha.300'}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={'transparent'}
            pl={5}
          >
            {t('response')}
            {loading && (
              <Text as="span" ml={40} fontSize="md">
                {t('loading')}
              </Text>
            )}
          </Heading>
          <ResponseArea responseValue={responseValue} />
        </VStack>
      </VStack>
    </>
  );
}
