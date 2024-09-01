'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { CircularProgress } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, sendPasswordReset } from '../../../firebase';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Heading,
} from '@chakra-ui/react';

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading]);

  function onSubmit(values) {
    sendPasswordReset(values.email);
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress isIndeterminate size="100px" thickness="4px" />
      </Box>
    );
  }

  return (
    <>
      <Heading as="h2" size="xl">
        Reset password
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.email)} mt={4}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              },
            })}
          />
          <Box height="1.5rem">
            <FormErrorMessage>
              {errors.email && String(errors.email.message)}
            </FormErrorMessage>
          </Box>
        </FormControl>
        <Button
          w={400}
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Send password reset email
        </Button>
      </form>
    </>
  );
}
