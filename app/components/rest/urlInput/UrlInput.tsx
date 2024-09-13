import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import {
  changeUrl,
  changeUrlError,
} from '../../../store/slices/restInputsSlice';

const UrlInput: React.FC = () => {
  const [urlValue, setUrlValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateUrlError = useSelector(
    (state: RootState) => state.restInputs.urlError
  );

  useEffect(() => {
    setUrlValue(stateUrl);
  }, [stateUrl]);
  const handleUrlChange = (e: { target: { value: string } }) => {
    dispatch(changeUrlError(false));
    const newUrl = e.target.value;
    setUrlValue(newUrl);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      dispatch(changeUrl(newUrl));
    }, 600);
    setTimeoutId(id);
  };
  return (
    <FormControl isInvalid={stateUrlError} width="100%">
      <InputGroup size="md">
        <InputLeftAddon>url</InputLeftAddon>
        <Input value={urlValue} onChange={handleUrlChange} />
      </InputGroup>
    </FormControl>
  );
};

export default UrlInput;
