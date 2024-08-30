import React, { useEffect, useState } from 'react';
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

import { changeBody, changeUrlError } from '@/store/slices/restInputsSlice';
import { RootState } from '@/store/store';

const BodyInput: React.FC = () => {
  const storedTabIndex = localStorage.getItem('activeBodyTab');
  const initialTabIndex = storedTabIndex ? parseInt(storedTabIndex, 10) : 0;

  const [bodyError, setBodyError] = useState(false);
  const [bodyTextValue, setBodyTextValue] = useState('');
  const [bodyJsonValue, setBodyJsonValue] = useState('');
  const [activeTab, setActiveTab] = useState<number>(initialTabIndex);

  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateBody = useSelector((state: RootState) => state.restInputs.body);

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
  }, [stateBody]);

  const replaceVariable = (str) => {
    const LSVariables = JSON.parse(localStorage.getItem('localVariables'));

    return str.replace(
      /"{{(.*?)}}"|{{(.*?)}}/g,
      (_, quotedKey, unquotedKey) => {
        const key = quotedKey || unquotedKey;
        const variable = LSVariables.find((el) => el.key === key);
        return variable ? `"{{${key}}}"` : key;
      }
    );
  };
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
        <Tab>Text</Tab>
        <Tab>JSON</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Textarea
            as={TextareaAutosize}
            minHeight="120px"
            height="auto"
            value={bodyTextValue}
            placeholder="body text"
            onChange={changeBodyText}
            onBlur={handleBodyTextChange}
          />
        </TabPanel>
        <TabPanel>
          <Textarea
            as={TextareaAutosize}
            minHeight="120px"
            height="100%"
            value={bodyJsonValue}
            placeholder="body json"
            onChange={changeBodyJson}
            onBlur={handleBodyJsonChange}
            sx={{
              textDecoration: bodyError ? '#E53E3E wavy underline' : 'none',
            }}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default BodyInput;
