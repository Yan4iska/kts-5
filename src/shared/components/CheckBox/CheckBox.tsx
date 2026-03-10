import cn from 'classnames';
import React from 'react';

import CheckIcon from '../icons/CheckIcon';

import s from './CheckBox.module.scss';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, className, ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };
  return (
    <label className={cn(className, s.checkBox, props.disabled && s.checkBox_disabled)}>
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={s.checkBox__controller}
      />
      <CheckIcon className={s.checkBox__check} width={40} height={40} />
    </label>
  );
};

export default CheckBox;
