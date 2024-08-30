import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

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
  Stack,
  VStack,
} from '@chakra-ui/react';
import { changeHeaders } from '@/store/slices/restInputsSlice';

const HeadersInputs: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [headers, setHeaders] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);
  const [headerInputErrors, setHeaderInputErrors] = useState(
    headers.map(() => ({ key: false, value: false }))
  );

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
      const saveToStoreHeaders = [];
      newHeaders.forEach((header) => {
        if (header.key.trim() !== '') {
          const encodedHeaderValue = btoa(encodeURIComponent(header.value));
          params.set(header.key, encodedHeaderValue);
          saveToStoreHeaders.push({
            headerIndex: header.headerIndex,
            key: header.key,
            value: header.value,
          });
        }
      });
      dispatch(changeHeaders(saveToStoreHeaders));

      router.replace(`${pathname}?${params.toString()}`);

      const newHeaderInputErrors = [...headerInputErrors];
      if (!newHeaderInputErrors[index]) {
        newHeaderInputErrors[index] = { key: false, value: false };
      }
      newHeaderInputErrors[index][field] = !isValidHeaderInput(e.target.value);
      setHeaderInputErrors(newHeaderInputErrors);
    };

  return (
    <Accordion allowToggle>
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
    </Accordion>
  );
};

export default HeadersInputs;
