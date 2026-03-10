import cn from 'classnames';
import React from 'react';

import s from './Input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, ...props }, ref) => {
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
      },
      [onChange]
    );
    return (
      <label className={cn(className, s.input, props.disabled && s.input_disabled)}>
        <input
          {...props}
          value={value}
          ref={ref}
          type="text"
          className={s.input__field}
          onChange={handleChange}
        />
        {afterSlot && <div className={s.input__after}>{afterSlot}</div>}
      </label>
    );
  }
);

export default Input;
