import React from 'react';

import classNames from 'classnames';

import styles from './Dropdown.module.scss';

export type Option = {
  key: string;
  name: string;
};

export type DropdownProps = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  disabled?: boolean;
  title?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, disabled, title }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (disabled) return;
    setOpen(!open);
  };

  React.useEffect(() => {
    setOpen(false);
  }, [disabled]);

  const handleChange = (obj: Option) => {
    if (value.name !== obj.name) {
      onChange(obj);
      setOpen(false);
    }
  };

  return (
    <div className={classNames(styles.dropdown, open && styles.focus, disabled && styles.disabled)}>
      <div className={styles.title} onClick={handleClick}>
        {title} {value.name}
      </div>
      {open && (
        <div className={styles.selectable}>
          {options.map((obj) => (
            <div
              key={obj.key}
              onClick={() => handleChange(obj)}
              className={classNames(styles.select, value.name === obj.name && styles.selected)}
            >
              {obj.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
