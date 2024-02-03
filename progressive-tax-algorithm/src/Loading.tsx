import React from 'react';
import styles from './Loading.module.scss';
import Spinner from './assets/logo192.png';

const Loading = () => {
  return (
    <div className={styles['loading-border']}>
      <img
        className={styles['spinner']}
        src={Spinner}
        alt="로딩중"
        width={'100px'}
      />
    </div>
  );
};

export default Loading;
