import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import VariablesEditor from '@/components/graphql/VariablesEditor';
import { CloseIcon } from '@chakra-ui/icons';

interface StyledTabsProps {
  variablesJson: object;
  handleVariablesChange: (variables: object) => void;
  headers: { key: string; value: string }[];
  updateHeader: (index: number, type: 'key' | 'value', value: string) => void;
  removeHeader: (index: number) => void;
  addHeader: () => void;
}

const StyledTabs = ({
  variablesJson,
  handleVariablesChange,
  headers,
  updateHeader,
  removeHeader,
  addHeader,
}: StyledTabsProps) => {
  const t = useTranslations();

  return (
    <Tabs variant="unstyled">
      <TabList
        display="flex"
        gap={1}
        borderBottom="2px solid"
        borderColor="gray.200"
        padding="4px"
        backgroundColor="gray.50"
      >
        <Tab
          padding="8px 16px"
          borderRadius="md"
          fontWeight="bold"
          _selected={{
            bg: 'blue.500',
            color: 'white',
            borderBottom: '2px solid blue.500',
          }}
          _hover={{ bg: 'blue.100', color: 'blue.700' }}
          _focus={{ boxShadow: 'outline' }}
        >
          {t('variables')}
        </Tab>
        <Tab
          padding="8px 16px"
          borderRadius="md"
          fontWeight="bold"
          _selected={{
            bg: 'blue.500',
            color: 'white',
            borderBottom: '2px solid blue.500',
          }}
          _hover={{ bg: 'blue.100', color: 'blue.700' }}
          _focus={{ boxShadow: 'outline' }}
        >
          {t('headers')}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VariablesEditor
            variablesJson={variablesJson}
            setVariablesJson={handleVariablesChange}
          />
        </TabPanel>
        <TabPanel>
          <Button
            colorScheme="teal"
            size="sm"
            textTransform="uppercase"
            onClick={addHeader}
          >
            + {t('addHeader')}
          </Button>
          {headers.map((header, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={2}
              width="full"
              mt={2}
              borderColor={index % 2 === 0 ? 'teal.500' : 'blue.500'} // Example: alternate between teal and blue
            >
              <Flex justify="space-between" gap={2} alignItems="center">
                <Box w="full">
                  <Input
                    placeholder={t('key')}
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    borderColor={'gray.600'}
                  />
                </Box>
                <Box w="full">
                  <Input
                    placeholder={t('value')}
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(index, 'value', e.target.value)
                    }
                    borderColor={'gray.600'}
                  />
                </Box>
                <IconButton
                  aria-label={t('removeHeader')}
                  icon={<CloseIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeHeader(index)}
                />
              </Flex>
            </Box>
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StyledTabs;
