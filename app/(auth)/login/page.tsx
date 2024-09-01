'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { CircularProgress, Link } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, logInWithEmailAndPassword } from '../../../firebase';
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
    logInWithEmailAndPassword(values.email, values.password);
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
        Login
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.email)} mt={4}>
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
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&\u00C0-\u017F\u0400-\u04FF\u1E00-\u1EFF]{8,}$/,
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
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/reset"
          >
            Forgot Password
          </Link>
        </Box>
        <div>
          Don't have an account?{' '}
          <Link
            as={NextLink}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/register"
          >
            Register
          </Link>{' '}
          now.
        </div>
      </form>
    </>
  );
}
