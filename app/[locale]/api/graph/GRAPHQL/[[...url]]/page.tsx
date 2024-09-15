'use client';

import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import UrlInput from '@/components/rest/urlInput/UrlInput';
import GraphqlEditor from '@/components/graphql/GraphqlEditor';
import SdlInput from '@/components/graphql/SdlInput';
import useDebounce from '@/helpers/useDebounce';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useAuthCheck from '@/hooks/useAuthCheck';

export default function Graphql() {
  useAuthCheck();
  const [url, setUrl] = useState('');
  const [sdlUrl, setSdlUrl] = useState('');
  const debouncedUrl = useDebounce(url, 600);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const pathArray = pathname.split('/');
    const encodedUrl = pathArray[5];

    if (encodedUrl) {
      const decodedUrl = decodeURIComponent(atob(encodedUrl));
      setUrl(decodedUrl);
    }
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

      <GraphqlEditor url={url} sdlUrl={sdlUrl} />
    </Flex>
  );
}
