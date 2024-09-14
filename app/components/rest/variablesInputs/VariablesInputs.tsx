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
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { RootState } from '@/store/store';
import { changeHeaders } from '../../../store/slices/restInputsSlice';
import { useTranslations } from 'next-intl';

const VariablesInputs: React.FC = () => {
  const t = useTranslations();

  const [variables, setVariables] = useState<
    { variableIndex: number; key: string; value: string }[]
  >([]);

  const dispatch = useDispatch();
  const stateHeaders = useSelector(
    (state: RootState) => state.restInputs.headers
  );

  const [headers, setHeaders] = useState<
    { headerIndex: number; key: string; value: string }[]
  >([]);

  useEffect(() => {
    setHeaders(stateHeaders);
    const stateVariables = stateHeaders.filter((el) => el.key === 'variables');
    const storedVariables =
      stateVariables.length !== 0 ? JSON.parse(stateVariables[0].value) : [];
    setVariables(storedVariables);
  }, [stateHeaders]);

  const addVariable = () => {
    setVariables([
      ...variables,
      { variableIndex: variables.length, key: '', value: '' },
    ]);
  };

  const saveVariables = (newVariables) => {
    let newHeaders = [];
    if (headers.some((header) => header.key === 'variables')) {
      if (newVariables.length !== 0) {
        newHeaders = headers.map((header) =>
          header.key === 'variables'
            ? { ...header, value: JSON.stringify(newVariables) }
            : header
        );
      } else {
        newHeaders = headers.filter((header) => header.key !== 'variables');
      }
    } else {
      newHeaders = [
        ...headers,
        {
          headerIndex: headers.length,
          key: 'variables',
          value: JSON.stringify(newVariables),
        },
      ];
    }
    dispatch(changeHeaders(newHeaders));
  };

  const deleteVariable = (index) => {
    const newVariables = variables.filter((el, i) => i !== index);
    setVariables(newVariables);
    saveVariables(newVariables);
  };

  const handleVariablesChange =
    (index: number, field: 'key' | 'value') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariables = [...variables];
      newVariables[index][field] = e.target.value;
      setVariables(newVariables);
      saveVariables(newVariables);
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
                {t('variables')}
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
              width="min-content"
              onClick={addVariable}
            >
              {t('newVariable')}
            </Button>
            {variables.map((variable, index) => (
              <Stack key={index} align="center" direction="row">
                <InputGroup size="md">
                  <InputLeftAddon>{t('key')}</InputLeftAddon>
                  <Input
                    value={variable.key}
                    onChange={handleVariablesChange(index, 'key')}
                  />
                </InputGroup>
                <InputGroup size="md">
                  <InputLeftAddon>{t('value')}</InputLeftAddon>
                  <Input
                    value={variable.value}
                    onChange={handleVariablesChange(index, 'value')}
                  />
                </InputGroup>
                <Button
                  colorScheme="teal"
                  size="sm"
                  width="max-content"
                  flex="none"
                  textTransform="uppercase"
                  onClick={() => deleteVariable(index)}
                >
                  {t('delete')}
                </Button>
              </Stack>
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default VariablesInputs;
