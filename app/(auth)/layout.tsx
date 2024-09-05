import { Box } from '@chakra-ui/react';
import styles from './styles.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={`calc(100vh - 50px - 150px - 6rem)`}
    >
      <div className={styles.formWrapper}>{children}</div>
    </Box>
  );
}
