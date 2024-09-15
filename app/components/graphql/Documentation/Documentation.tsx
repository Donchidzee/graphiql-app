import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

interface Field {
  name: string;
  description?: string;
  type: TypeRef;
}

interface TypeRef {
  kind: string;
  name?: string;
  ofType?: TypeRef;
}

interface Type {
  kind: string;
  name: string;
  description?: string;
  fields?: Field[];
}

export interface Schema {
  types: Type[];
}

interface DocumentationProps {
  schema: Schema | null;
}

const getTypeName = (type: TypeRef): string => {
  if (type.name) return type.name;
  if (type.ofType) return getTypeName(type.ofType);
  return '';
};

const Documentation: React.FC<DocumentationProps> = ({ schema }) => {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'query' | 'mutation' | 'none'>(
    'none'
  );
  const t = useTranslations();

  const handleFieldToggle = (fieldName: string) => {
    setExpandedField((prev) => (prev === fieldName ? null : fieldName));
  };

  const handleTypeToggle = (typeName: string) => {
    setExpandedType((prev) => (prev === typeName ? null : typeName));
  };

  const handleViewChange = (view: 'query' | 'mutation') => {
    setCurrentView(view);
    setExpandedField(null);
    setExpandedType(null);
  };

  if (!schema) {
    return <Text>{t('noSchema')}</Text>;
  }

  const queryType = schema.types.find((type) => type.name === 'Query');
  const mutationType = schema.types.find((type) => type.name === 'Mutation');

  const renderTypeFields = (type: Type | undefined) => {
    if (!type || !type.fields || type.fields.length === 0) {
      return <Text>No fields available for this type.</Text>;
    }

    return (
      <VStack spacing={3} align="stretch">
        {type.fields.map((typeField) => (
          <Box
            key={typeField.name}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.300"
            bg="white"
            shadow="sm"
          >
            <Text fontSize="md" fontWeight="bold">
              {typeField.name}
              <Badge ml={2} colorScheme="blue" variant="outline">
                {getTypeName(typeField.type)}
              </Badge>
            </Text>
            {typeField.description && (
              <Text mt={1} fontSize="sm" color="gray.600">
                {typeField.description}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    );
  };

  return (
    <Stack spacing={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
      {currentView === 'none' && (
        <Stack spacing={4}>
          {queryType && (
            <Button
              w="full"
              colorScheme="teal"
              onClick={() => handleViewChange('query')}
            >
              Query
            </Button>
          )}
          {mutationType && (
            <Button
              w="full"
              colorScheme="purple"
              onClick={() => handleViewChange('mutation')}
            >
              Mutation
            </Button>
          )}
          {!queryType && !mutationType && <Text> {t('noSchema')}</Text>}
        </Stack>
      )}

      {(currentView === 'query' || currentView === 'mutation') && (
        <Stack spacing={4}>
          <Button
            w="full"
            variant="outline"
            onClick={() => setCurrentView('none')}
          >
            ← Back
          </Button>

          {currentView === 'query' && queryType && (
            <Stack spacing={4}>
              {queryType.fields && queryType.fields.length > 0 ? (
                queryType.fields.map((field) => (
                  <Box
                    key={field.name}
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Button
                      w="full"
                      textAlign="left"
                      variant="solid"
                      colorScheme="teal"
                      onClick={() => handleFieldToggle(field.name)}
                      fontWeight="bold"
                    >
                      {field.name}
                    </Button>
                    <Collapse in={expandedField === field.name}>
                      <Box p={4} bg="gray.50">
                        {field.description && (
                          <Text mb={4} fontSize="sm" color="gray.600">
                            <strong>Description:</strong> {field.description}
                          </Text>
                        )}
                        <Text fontSize="md">
                          <strong>Type:</strong> {getTypeName(field.type)}
                        </Text>
                        <Button
                          mt={4}
                          w="full"
                          textAlign="left"
                          variant="outline"
                          colorScheme="blue"
                          onClick={() =>
                            handleTypeToggle(getTypeName(field.type))
                          }
                        >
                          View {getTypeName(field.type)} Details
                        </Button>
                        <Collapse in={expandedType === getTypeName(field.type)}>
                          <Box mt={4} p={4} bg="gray.100">
                            {renderTypeFields(
                              schema.types.find(
                                (type) => type.name === getTypeName(field.type)
                              )
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Text>No fields available for the Query type.</Text>
              )}
            </Stack>
          )}

          {currentView === 'mutation' && mutationType && (
            <Stack spacing={4}>
              {mutationType.fields && mutationType.fields.length > 0 ? (
                mutationType.fields.map((field) => (
                  <Box
                    key={field.name}
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Button
                      w="full"
                      textAlign="left"
                      variant="solid"
                      colorScheme="purple"
                      onClick={() => handleFieldToggle(field.name)}
                      fontWeight="bold"
                    >
                      {field.name}
                    </Button>
                    <Collapse in={expandedField === field.name}>
                      <Box p={4} bg="gray.50">
                        {field.description && (
                          <Text mb={4} fontSize="sm" color="gray.600">
                            <strong>Description:</strong> {field.description}
                          </Text>
                        )}
                        <Text fontSize="md">
                          <strong>Type:</strong> {getTypeName(field.type)}
                        </Text>
                        <Button
                          mt={4}
                          w="full"
                          textAlign="left"
                          variant="outline"
                          colorScheme="blue"
                          onClick={() =>
                            handleTypeToggle(getTypeName(field.type))
                          }
                        >
                          View {getTypeName(field.type)} Details
                        </Button>
                        <Collapse in={expandedType === getTypeName(field.type)}>
                          <Box mt={4} p={4} bg="gray.100">
                            {renderTypeFields(
                              schema.types.find(
                                (type) => type.name === getTypeName(field.type)
                              )
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Text>No fields available for the Mutation type.</Text>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default Documentation;
