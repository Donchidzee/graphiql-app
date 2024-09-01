import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { RootState } from '@/store/store';

const HeadersInputs: React.FC = () => {
  const dispatch = useDispatch();
  const stateHeaders = useSelector(
    (state: RootState) => state.restInputs.headers
  );

  const [headers, setHeaders] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);
  const [headerInputErrors, setHeaderInputErrors] = useState(
    headers.map(() => ({ key: false, value: false }))
  );

  useEffect(() => {
    setHeaders(stateHeaders);
  }, [stateHeaders]);

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
      const newHeaders = headers.map((header, i) =>
        i === index ? { ...header, [field]: e.target.value } : header
      );
      newHeaders[index][field] = e.target.value;
      setHeaders(newHeaders);
      console.log(newHeaders);

      dispatch(changeHeaders(newHeaders));

      const newHeaderInputErrors = [...headerInputErrors];
      if (!newHeaderInputErrors[index]) {
        newHeaderInputErrors[index] = { key: false, value: false };
      }
      newHeaderInputErrors[index][field] = !isValidHeaderInput(e.target.value);
      setHeaderInputErrors(newHeaderInputErrors);
    };

  return (
    <Accordion defaultIndex={[0]} allowToggle>
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
