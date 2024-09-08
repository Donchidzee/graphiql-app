import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!locale.includes(locale as never)) notFound();

  return {
    messages: (await import(`/src/locales/${locale}.json`)).default,
  };
});
