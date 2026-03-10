import cn from 'classnames';
import React from 'react';

import Loader from '../Loader';
import Text from '../Text';

import s from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ className, loading, children = null, ...props }) => {
  return (
    <button
      {...props}
      className={cn(className, s.button, props.disabled && s.button_disabled)}
      disabled={props.disabled || loading}
    >
      {loading && <Loader className={s.button__loader} size="s" />}
      <Text className={s.button__text} tag="span" view="button">
        {children}
      </Text>
    </button>
  );
};

export default Button;
