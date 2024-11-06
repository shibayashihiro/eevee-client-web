import React, { FC } from 'react';

import styles from './BalloonToLeft.module.css';

type Props = {
  children: React.ReactNode;
};

export const BalloonToLeft: FC<Props> = ({ children }) => {
  return <div className={styles.balloon}>{children}</div>;
};
