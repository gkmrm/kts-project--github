import React from 'react';

import classNames from 'classnames';

import styles from './Dropdown.module.scss';

export type Option = {
  key: string;
  name: string;
};

export type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  title?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, disabled, title }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (disabled) return;
    setOpen(!open);
  };

  const handleChange = (obj: Option) => {
    if (value !== obj.key) {
      onChange(obj.key);
      setOpen(false);
    }
  };

  return (
    <div className={classNames(styles.dropdown, open && styles.focus, disabled && styles.disabled)}>
      <div className={styles.title} onClick={handleClick}>
        {title} {value}
      </div>
      {open && (
        <div className={styles.selectable}>
          {options.map((obj) => (
            <div
              key={obj.key}
              onClick={() => handleChange(obj)}
              className={classNames(styles.select, value === obj.key && styles.selected)}
            >
              {obj.key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
