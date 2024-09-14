import React, { useEffect, useState } from 'react';
import { Textarea } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { changeBody } from '../../../store/slices/restInputsSlice';
import gqlPrettier from 'graphql-prettier';
import useDebounce from '@/helpers/useDebounce';

const BodyInput: React.FC = () => {
  const [body, setBody] = useState<string>('');
  const [debouncedBody, setDebouncedBody] = useState<string>('');
  const dispatch = useAppDispatch();
  const stateBody = useAppSelector((state) => state.restInputs.body);

  const debouncedValue = useDebounce(body, 500);

  console.log(debouncedBody);

  useEffect(() => {
    setBody(stateBody);
  }, [stateBody]);

  useEffect(() => {
    setDebouncedBody(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleBlur = () => {
    const prettifiedBody = gqlPrettier(body);
    dispatch(changeBody(prettifiedBody));
  };

  return (
    <Textarea
      value={body}
      height={'100%'}
      onChange={handleChange}
      onBlur={handleBlur} // Optional: Handle blur to dispatch the prettified body
      placeholder="Enter your GraphQL query"
      bg="gray.800" // Dark background
      color="white" // Light text color
      fontFamily="'Source Code Pro', monospace" // Monospace font for code
      fontSize="sm" // Adjust font size for code readability
      borderRadius="md" // Rounded corners
      borderColor="gray.600" // Border color
      borderWidth="1px" // Border width
      _focus={{ borderColor: 'blue.500' }} // Border color on focus
      resize={'none'}
    />
  );
};

export default BodyInput;
