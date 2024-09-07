import { Select } from '@chakra-ui/react';
import styles from './styles.module.css';

interface LanguagePickerProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguagePicker = ({
  selectedLanguage,
  onLanguageChange,
}: LanguagePickerProps) => {
  return (
    <div className={styles.languageSelectWrapper}>
      <Select
        size="xs"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        placeholder="Select language"
      >
        <option value="ru">Русский</option>
        <option value="en-US">English</option>
      </Select>
    </div>
  );
};

export default LanguagePicker;
