// components/SdlUrlInput.tsx
import React from 'react';
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';

interface SdlUrlInputProps {
  sdlUrlValue: string;
  setSdlUrlValue: (value: string) => void;
}

const SdlUrlInput: React.FC<SdlUrlInputProps> = ({
  sdlUrlValue,
  setSdlUrlValue,
}) => {
  const handleSdlUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSdlUrlValue(e.target.value);
  };

  return (
    <FormControl width="100%">
      <InputGroup size="md">
        <InputLeftAddon>SDL URL</InputLeftAddon>
        <Input
          value={sdlUrlValue}
          onChange={handleSdlUrlChange}
          onBlur={() => localStorage.setItem('sdlUrl', sdlUrlValue)} // Update localStorage on blur
        />
      </InputGroup>
    </FormControl>
  );
};

export default SdlUrlInput;
