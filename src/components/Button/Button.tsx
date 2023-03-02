import React from 'react';

import classNames from 'classnames';

import BackIcon from './BackIcon.svg';
import styles from './Button.module.scss';
import Loupe from './Loupe.svg';

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
  backPage?: boolean;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, loading = false, className, backPage = false, ...rest }) => {
  const classes = classNames(
    styles.button,
    className,
    {
      [styles.button_disabled]: rest.disabled,
    },
    { [styles.button_disabled]: loading },
    { [styles.button_backPage]: backPage }
  );

  return (
    <button className={classes} {...rest} disabled={rest?.disabled || loading}>
      {backPage ? <img src={BackIcon} alt="BackIcon" /> : <img src={Loupe} alt="Loupe" />}
    </button>
  );
};

export default Button;
