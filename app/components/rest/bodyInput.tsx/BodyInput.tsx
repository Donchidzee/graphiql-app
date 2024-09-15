import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';

import {
  changeBody,
  changeUrlError,
} from '../../../store/slices/restInputsSlice';
import { RootState } from '../../../store/store';
import { useTranslations } from 'next-intl';
import { useBodyFocusAndBlurListeners } from '../../../../src/helpers/helpers';
import { BodyInputRef } from '@/types/restTypes';

const BodyInput: React.FC<BodyInputRef> = ({
  bodyTextInputRef,
  bodyJsonInputRef,
  handleBodyTextInputFocus,
}) => {
  const t = useTranslations();

  const [bodyError, setBodyError] = useState(false);
  const [bodyTextValue, setBodyTextValue] = useState('');
  const [bodyJsonValue, setBodyJsonValue] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);

  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateBody = useSelector((state: RootState) => state.restInputs.body);
  const [variables, setVariables] = useState<
    { variableIndex: number; key: string; value: string }[]
  >([]);
  const stateHeaders = useSelector(
    (state: RootState) => state.restInputs.headers
  );

  useEffect(() => {
    const stateVariables = stateHeaders.filter((el) => el.key === 'variables');
    const storedVariables =
      stateVariables.length !== 0 ? JSON.parse(stateVariables[0].value) : [];
    if (JSON.stringify(storedVariables) !== JSON.stringify(variables)) {
      setVariables(storedVariables);
    }
  }, [stateHeaders, variables]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTabIndex = localStorage.getItem('activeBodyTab');
      const initialTabIndex = storedTabIndex ? parseInt(storedTabIndex, 10) : 0;
      setActiveTab(initialTabIndex);
    }
  }, []);

  const handleFocus = () => handleBodyTextInputFocus(true);
  const handleBlur = () => handleBodyTextInputFocus(false);

  useBodyFocusAndBlurListeners(
    [bodyTextInputRef, bodyJsonInputRef],
    handleFocus,
    handleBlur
  );

  const replaceVariable = useCallback(
    (str) => {
      const firstChar = str.charAt(0) === '{' ? '{' : '';
      const restOfString = firstChar ? str.slice(1) : str;

      const replacedString = restOfString.replace(
        /"{{(.*?)}}"|{{(.*?)}}/g,
        (_, quotedKey, unquotedKey) => {
          const key = quotedKey || unquotedKey;
          const variable = variables.find((el) => el.key === key);
          return variable ? `"{{${key}}}"` : key;
        }
      );
      return firstChar + replacedString;
    },
    [variables]
  );

  useEffect(() => {
    setBodyTextValue(stateBody);

    if (stateBody !== '') {
      try {
        const replacedVariablesText = replaceVariable(stateBody);
        setBodyJsonValue(
          JSON.stringify(JSON.parse(replacedVariablesText), null, 6)
        );
        setBodyError(false);
      } catch {
        setBodyJsonValue(stateBody);
        setBodyError(true);
      }
    }
  }, [stateBody, replaceVariable]);

  const changeBodyText = (e: { target: { value: string } }) => {
    const text = e.target.value;
    setBodyTextValue(text);
  };
  const changeBodyJson = (e: { target: { value: string } }) => {
    const text = e.target.value.replace(/\s+/g, ' ').trim();
    setBodyJsonValue(text);
    if (text !== '') {
      try {
        const replacedVariablesText = replaceVariable(text);
        setBodyTextValue(text);
        setBodyJsonValue(
          JSON.stringify(JSON.parse(replacedVariablesText), null, 6)
        );
        setBodyError(false);
      } catch {
        setBodyJsonValue(text);
        setBodyTextValue(text);
        setBodyError(true);
      }
    }
  };
  const handleBodyTextChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (stateUrl === '') {
      dispatch(changeUrlError(true));
    } else {
      dispatch(changeUrlError(false));
      dispatch(changeBody(text));
    }
  };
  const handleBodyJsonChange = (e: { target: { value: string } }) => {
    const text = e.target.value.replace(/\s+/g, ' ').trim();
    if (stateUrl === '') {
      dispatch(changeUrlError(true));
    } else {
      dispatch(changeUrlError(false));
      dispatch(changeBody(text));
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    localStorage.setItem('activeBodyTab', index.toString());
  };

  return (
    <Tabs width="100%" index={activeTab} onChange={handleTabChange}>
      <TabList>
        <Tab color={'teal'}>{t('text')}</Tab>
        <Tab color={'teal'}>JSON</Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={0}>
          <Textarea
            as={TextareaAutosize}
            minHeight="120px"
            height="auto"
            value={bodyTextValue}
            placeholder={t('bodyText')}
            onChange={changeBodyText}
            onBlur={handleBodyTextChange}
            ref={bodyTextInputRef}
            bg={'gray.800'}
            color={'white'}
            fontFamily="'Source Code Pro', monospace"
            fontSize="sm"
            p={4}
            borderRadius="md"
            borderColor="gray.600"
            borderWidth="1px"
            _focus={{ borderColor: 'blue.500' }}
          />
        </TabPanel>
        <TabPanel px={0}>
          <Textarea
            as={TextareaAutosize}
            minHeight="120px"
            height="100%"
            value={bodyJsonValue}
            placeholder={t('bodyJson')}
            onChange={changeBodyJson}
            onBlur={handleBodyJsonChange}
            ref={bodyJsonInputRef}
            sx={{
              textDecoration: bodyError ? '#E53E3E wavy underline' : 'none',
            }}
            bg={'gray.800'}
            color={'white'}
            fontFamily="'Source Code Pro', monospace"
            fontSize="sm"
            p={4}
            borderRadius="md"
            borderColor="gray.600"
            borderWidth="1px"
            _focus={{ borderColor: 'blue.500' }}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default BodyInput;
