import React, { useEffect, useState } from 'react';
import { FormControl, Textarea } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changeBody } from '@/store/slices/restInputsSlice';
import gqlPrettier from 'graphql-prettier';

const BodyInput: React.FC = () => {
  const [body, setBody] = useState<string>('');
  const dispatch = useAppDispatch();
  const stateBody = useAppSelector((state) => state.restInputs.body);

  useEffect(() => {
    setBody(stateBody);
  }, [stateBody]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setBody(newBody);
  };

  const handleBlur = () => {
    const prettifiedBody = gqlPrettier(body);
    dispatch(changeBody(prettifiedBody));
    setBody(prettifiedBody);
  };

  return (
    <FormControl>
      <Textarea
        value={body}
        height="300px"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your GraphQL query"
        bg="gray.800" // Dark background
        color="white" // Light text color
        fontFamily="'Source Code Pro', monospace" // Monospace font for code
        fontSize="sm" // Adjust font size for code readability
        p={4} // Padding for better spacing
        borderRadius="md" // Rounded corners
        borderColor="gray.600" // Border color
        borderWidth="1px" // Border width
        _focus={{ borderColor: 'blue.500' }} // Border color on focus
      />
    </FormControl>
  );
};

export default BodyInput;
