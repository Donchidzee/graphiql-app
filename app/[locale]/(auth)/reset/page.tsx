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
import { auth, sendPasswordReset } from '../../../../firebase';
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
        {t('reset')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.email)} mt={4}>
          <FormLabel htmlFor="email">{t('email')}</FormLabel>
          <Input
            id="email"
            placeholder="example@gmail.com"
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
          {t('resetButton')}
        </Button>
        <Box mt={3}>
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
        </Box>
      </form>
    </>
  );
}
