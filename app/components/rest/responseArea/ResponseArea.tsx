import React from 'react';

import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import { ResponseAreaProps } from '@/types/restTypes';
import { useTranslations } from 'next-intl';

const ResponseArea: React.FC<ResponseAreaProps> = ({ responseValue }) => {
  const t = useTranslations();

  return (
    <Tabs width="100%">
      <TabList>
        <Tab textTransform="uppercase">{t('status')}</Tab>
        <Tab textTransform="uppercase">{t('body')}</Tab>
        <Tab textTransform="uppercase">{t('headers')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel color="blue.600">
          <p>
            {responseValue.status !== undefined ? responseValue.status : ''}
          </p>
        </TabPanel>
        <TabPanel>
          <Textarea
            as={TextareaAutosize}
            maxHeight="50vh"
            isDisabled
            placeholder={
              responseValue.data !== undefined ? responseValue.data : ''
            }
            size="sm"
            sx={{
              ':disabled': {
                opacity: 0.8,
              },
              '::placeholder': {
                color: 'blue.600',
              },
            }}
          />
        </TabPanel>
        <TabPanel>
          <Textarea
            as={TextareaAutosize}
            maxHeight="50vh"
            isDisabled
            placeholder={
              responseValue.headers !== undefined
                ? JSON.stringify(
                    Object.fromEntries(responseValue.headers.entries()),
                    null,
                    2
                  )
                : ''
            }
            size="sm"
            sx={{
              ':disabled': {
                opacity: 0.8,
              },
              '::placeholder': {
                color: 'blue.600',
              },
            }}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ResponseArea;
