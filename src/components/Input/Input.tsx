import React from 'react';

import styles from './Input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

export const Input: React.FC<InputProps> = ({ value, onChange, className = '', ...rest }) => {
  const handleInputChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    onChange(target.value);
  };

  const inputClassName = `${styles.input} ${className} ${rest.disabled && styles.input_disabled}`;

  return <input className={inputClassName} value={value} onChange={handleInputChange} {...rest} />;
};
