'use client';

import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import GraphqlEditor from '../../../../../components/graphql/GraphqlEditor/GraphqlEditor';
import SdlInput from '../../../../../components/graphql/SdlInput';
import useDebounce from '../../../../../../src/helpers/useDebounce';
import { useState, useEffect } from 'react';
import useAuthCheck from '../../../../../hooks/useAuthCheck';
import { usePathname, useRouter } from 'next/navigation';
import UrlInput from '../../../../../components/graphql/urlInput/UrlInput';

type HeadersObject = Record<string, string>;

export default function Graphql() {
  useAuthCheck();
  const [url, setUrl] = useState('');
  const [sdlUrl, setSdlUrl] = useState('');
  const [query, setQuery] = useState('');
  const [variables, setVariables] = useState('{}');
  const [headers, setHeaders] = useState<string>('');

  const debouncedUrl = useDebounce(url, 600);
  const debouncedQuery = useDebounce(query, 600);
  const debouncedHeaders = useDebounce(headers, 600);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const pathArray = pathname.split('/');
    const encodedUrl = pathArray[5];
    const encodedBody = pathArray[6];

    if (encodedUrl) {
      const decodedUrl = decodeURIComponent(atob(encodedUrl));
      setUrl(decodedUrl);
    }

    if (encodedBody) {
      const decodedBody = decodeURIComponent(atob(encodedBody));
      setQuery(decodedBody);
    }

    const queryParams = new URLSearchParams(window.location.search);
    const headersObj: HeadersObject = {};

    queryParams.forEach((value, key) => {
      headersObj[key] = value;
    });

    if (!headersObj['Content-Type']) {
      headersObj['Content-Type'] = 'application/json';
    }

    setHeaders(JSON.stringify(headersObj));
  }, [pathname]);
  useEffect(() => {
    if (debouncedUrl) {
      const encodedNewUrl = btoa(encodeURIComponent(debouncedUrl));
      const pathArray = pathname.split('/');
      pathArray[5] = encodedNewUrl;
      const newPath = `${pathArray.join('/')}`;
      router.replace(newPath);
    }
  }, [debouncedUrl, router, pathname]);

  useEffect(() => {
    const encodedNewBody = btoa(encodeURIComponent(debouncedQuery));
    const queryParams = new URLSearchParams();
    if (debouncedHeaders) {
      let headersObj: HeadersObject = {};
      try {
        headersObj = JSON.parse(debouncedHeaders);
      } catch (error) {
        console.warn('Invalid headers JSON, using empty headers', error);
      }

      if (!headersObj['Content-Type']) {
        headersObj['Content-Type'] = 'application/json';
      }

      for (const [key, value] of Object.entries(headersObj)) {
        queryParams.append(key, value);
      }
    } else {
      queryParams.append('Content-Type', 'application/json');
    }

    const pathArray = pathname.split('/');
    pathArray[6] = encodedNewBody;

    const newPath = `${pathArray.join('/')}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    window.history.replaceState(null, '', newPath);
  }, [debouncedQuery, router, pathname, debouncedHeaders]);

  useEffect(() => {
    if (debouncedUrl) {
      setSdlUrl(`${debouncedUrl}?sdl`);
    }
  }, [debouncedUrl]);

  return (
    <Flex direction="column" align="center" p={5}>
      <Box w="full" maxW="1400px" overflow="hidden" p={5}>
        <Heading size="md" mb={4} textAlign="center">
          GraphiQL Client
        </Heading>

        <Stack spacing={4} align="center">
          <Flex
            direction="column"
            width="full"
            maxW="600px"
            align="center"
            gap={3}
          >
            <UrlInput urlValue={url} setUrlValue={setUrl} />
            <SdlInput sdlUrlValue={sdlUrl} setSdlUrlValue={setSdlUrl} />
          </Flex>
        </Stack>
      </Box>

      <GraphqlEditor
        url={debouncedUrl}
        sdlUrl={sdlUrl}
        query={query}
        variables={variables}
        headers={headers}
        onQueryChange={setQuery}
        onVariablesChange={setVariables}
        onHeadersChange={setHeaders}
      />
    </Flex>
  );
}
