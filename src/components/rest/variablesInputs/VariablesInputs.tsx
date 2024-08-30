import React, { useEffect, useState } from 'react';

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

const VariablesInputs: React.FC = () => {
  const [variables, setVariables] = useState<
    { variableIndex: number; key: string; value: string }[]
  >([]);

  useEffect(() => {
    localStorage.setItem('localVariables', JSON.stringify(variables));
  }, [variables]);

  const addVariable = () => {
    setVariables([
      ...variables,
      { variableIndex: variables.length, key: '', value: '' },
    ]);
  };

  const deleteVariable = () => {
    console.log('deleting');
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
                <Button
                  colorScheme="teal"
                  size="sm"
                  textTransform="uppercase"
                  onClick={deleteVariable}
                >
                  delete
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
