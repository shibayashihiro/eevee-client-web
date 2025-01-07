import styles from './BalloonToLeft.module.css';

type Props = {
  children: React.ReactNode;
};

export const BalloonToLeft = ({ children }: Props) => {
  return <div className={styles.balloon}>{children}</div>;
};
