import React from 'react';
import styles from './Loading.module.scss';
import Spinner from './assets/spinner.svg';

export default () => {
  return (
    <div className={styles['loading-border']}>
      <img src={Spinner} alt="로딩중" width={'150px'} />
    </div>
  );
};
