import React, { FC } from 'react';

import styles from './BalloonToBottom.module.css';

type Props = {
  children: React.ReactNode;
};

export const BalloonToBottom: FC<Props> = ({ children }) => {
  return <div className={styles.balloon}>{children}</div>;
};
