// components/UrlInput.tsx
import React from 'react';
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';

interface UrlInputProps {
  urlValue: string;
  setUrlValue: (value: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ urlValue, setUrlValue }) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(e.target.value);
  };

  return (
    <FormControl width="100%">
      <InputGroup size="md">
        <InputLeftAddon>URL</InputLeftAddon>
        <Input value={urlValue} onChange={handleUrlChange} />
      </InputGroup>
    </FormControl>
  );
};

export default UrlInput;
