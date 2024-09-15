import { Select } from '@chakra-ui/react';
import styles from './styles.module.css';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../../../routing';
import { ChangeEvent, useTransition } from 'react';

const LanguagePicker = () => {
  const activeLocale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as 'ru' | 'en';

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className={styles.languageSelectWrapper}>
      <Select
        size="sm"
        value={activeLocale}
        onChange={(e) => handleLanguageChange(e)}
        w={100}
        disabled={isPending}
      >
        <option value="ru">Русский</option>
        <option value="en">English</option>
      </Select>
    </div>
  );
};

export default LanguagePicker;
