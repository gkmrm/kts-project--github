import React from 'react';

import classNames from 'classnames';

import styles from './MultiDropdown.module.scss';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  pluralizeOptions: (value: Option[]) => string;
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  onChange,
  disabled,
  pluralizeOptions,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (disabled) return;
    setOpen(!open);
  };

  React.useEffect(() => {
    setOpen(false);
  }, [disabled]);

  const handleChange = (obj: Option) => {
    if (value.includes(obj)) {
      const filtered = value.filter((item) => item.key !== obj.key);
      onChange(filtered);
    } else {
      onChange([...value, obj]);
    }
  };

  const getClassName = (obj: Option) => {
    const selected = value.find((item) => item.key === obj.key);
    return classNames({
      selected: selected,
      select: true,
    });
  };

  return (
    <div className={classNames(styles.multidropdown, open && styles.focus, disabled && styles.disabled)}>
      <div className={styles.title} onClick={handleClick}>
        {pluralizeOptions(value)}
      </div>
      {open && (
        <div className={styles.selectable}>
          {options.map((obj) => (
            <div key={obj.key} onClick={() => handleChange(obj)} className={getClassName(obj)}>
              {obj.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
