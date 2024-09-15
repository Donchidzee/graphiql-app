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
import { auth, logInWithEmailAndPassword } from '../../../../firebase';
import { LinkInter } from '../../../../routing';
import { useTranslations } from 'next-intl';

export default function HookForm() {
  const t = useTranslations();

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
        {t('login')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.email)} mt={4}>
          <FormLabel htmlFor="email">{t('email')}</FormLabel>
          <Input
            id="email"
            placeholder="example@gmail.com"
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
          <FormLabel htmlFor="password">{t('password')}</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="password"
            autoComplete="on"
            {...register('password', {
              required: 'This is required',
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
          {t('submit')}
        </Button>
        <Box mt={3}>
          <Link
            as={LinkInter}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/reset"
          >
            {t('forgotPassword')}
          </Link>
        </Box>
        <div>
          {t('noAccount')}{' '}
          <Link
            as={LinkInter}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
            href="/register"
          >
            {t('signUp')}
          </Link>{' '}
          {t('now')}.
        </div>
      </form>
    </>
  );
}
