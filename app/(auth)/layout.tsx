import styles from './styles.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authLayout}>
      <div className={styles.formWrapper}>{children}</div>
    </div>
  );
}
