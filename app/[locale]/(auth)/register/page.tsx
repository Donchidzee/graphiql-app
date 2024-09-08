'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, registerWithEmailAndPassword } from '../../../../firebase';
import { LinkInter } from '../../../../routing';

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      router.push(`/`);
    }
  }, [user, loading, router]);

  function onSubmit(values) {
    registerWithEmailAndPassword(
      values.username,
      values.email,
      values.password
    );
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
        Register
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.username)} mt={4}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            placeholder="username"
            autoComplete="on"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
              maxLength: {
                value: 40,
                message: 'Username cannot exceed 40 characters',
              },
            })}
          />
          <Box height="1.5rem">
            <FormErrorMessage>
              {errors.username && String(errors.username.message)}
            </FormErrorMessage>
          </Box>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.email)} mt={-1}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="email"
            autoComplete="on"
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
        <FormControl isInvalid={Boolean(errors.password)} mt={-1}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="password"
            autoComplete="on"
            {...register('password', {
              required: 'This is required',
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#\u00C0-\u017F\u0400-\u04FF\u1E00-\u1EFF]{8,}$/,
                message:
                  'Password must contain at least one letter, one number, and one special character',
              },
            })}
          />
          <Box height="1.5rem">
            <FormErrorMessage>
              {errors.password && String(errors.password.message)}
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
          Submit
        </Button>
        <Box mt={3}>
          Already have an account?{' '}
          <Link
            as={LinkInter}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/login"
          >
            Login
          </Link>{' '}
          now.
        </Box>
      </form>
    </>
  );
}
