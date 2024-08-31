import React, { useState } from 'react';
import {
  Box,
  Collapse,
  Text,
  Stack,
  Button,
  Badge,
  VStack,
} from '@chakra-ui/react';

interface Field {
  name: string;
  description?: string;
}

interface Type {
  kind: string;
  name: string;
  description?: string;
  fields: Field[];
}

export interface Schema {
  types: Type[];
}

interface DocumentationProps {
  schema: Schema;
}

const Documentation: React.FC<DocumentationProps> = ({ schema }) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleToggle = (typeName: string) => {
    setExpandedType((prev) => (prev === typeName ? null : typeName));
  };

  const filteredTypes =
    schema &&
    schema.types?.filter(
      (type) => type.kind === 'OBJECT' && type.name.startsWith('__') === false
    );

  return (
    <Stack spacing={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
      {filteredTypes && filteredTypes.length > 0 ? (
        filteredTypes.map((type) => (
          <Box
            key={type.name}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
          >
            <Button
              w="full"
              textAlign="left"
              variant="solid"
              colorScheme="teal"
              onClick={() => handleToggle(type.name)}
              fontWeight="bold"
            >
              {type.name}
            </Button>
            <Collapse in={expandedType === type.name}>
              <Box p={4} bg="gray.50">
                {type.description && (
                  <Text mb={4} fontSize="sm" color="gray.600">
                    <strong>Description:</strong> {type.description}
                  </Text>
                )}
                {type.fields && type.fields.length > 0 && (
                  <VStack spacing={3} align="stretch">
                    {type.fields.map((field) => (
                      <Box
                        key={field.name}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor="gray.300"
                        bg="white"
                        shadow="sm"
                      >
                        <Text fontSize="md" fontWeight="bold">
                          {field.name}
                          <Badge ml={2} colorScheme="blue" variant="outline">
                            Field
                          </Badge>
                        </Text>
                        {field.description && (
                          <Text mt={1} fontSize="sm" color="gray.600">
                            {field.description}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </Collapse>
          </Box>
        ))
      ) : (
        <Text fontSize="md" color="gray.500" textAlign="center">
          Documentation will be visible after a successful request.
        </Text>
      )}
    </Stack>
  );
};

export default Documentation;
