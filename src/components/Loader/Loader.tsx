import React from 'react';

import classNames from 'classnames';

import styles from './Loader.module.scss';

export enum LoaderSize {
  s = 's',
  m = 'm',
  l = 'l',
}

export type LoaderProps = {
  loading?: boolean;
  size?: LoaderSize;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({ loading, size, className }) => {
  if (loading !== undefined)
    return <>{loading && <div className={classNames(styles.loader, size ? styles[size] : styles.m, className)} />}</>;
  return <div className={classNames(styles.loader, size ? styles.size : styles.l, className)} />;
};
