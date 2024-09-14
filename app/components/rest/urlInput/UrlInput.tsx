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
import useDebounce from '@/helpers/useDebounce';

const UrlInput: React.FC = () => {
  const [urlValue, setUrlValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedUrl, setDebouncedUrl] = useState('');

  const dispatch = useDispatch();
  const stateUrl = useSelector((state: RootState) => state.restInputs.url);
  const stateUrlError = useSelector(
    (state: RootState) => state.restInputs.urlError
  );

  const debouncedInput = useDebounce(urlValue, 500); // Debounce delay of 500ms

  useEffect(() => {
    // Set local state with the current URL from the global state
    setUrlValue(stateUrl);
  }, [stateUrl]);

  useEffect(() => {
    // Update the debounced URL when the input value changes
    setDebouncedUrl(debouncedInput);
  }, [debouncedInput]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setUrlValue(e.target.value);
  };

  const handleBlur = () => {
    // Dispatch changeUrl only onBlur with debounced URL
    dispatch(changeUrl(debouncedUrl));
  };

  return (
    <FormControl isInvalid={stateUrlError} width="100%">
      <InputGroup size="md">
        <InputLeftAddon>url</InputLeftAddon>
        <Input
          value={urlValue}
          onChange={handleUrlChange}
          onBlur={handleBlur} // Handle blur to dispatch the debounced value
        />
      </InputGroup>
    </FormControl>
  );
};

export default UrlInput;
