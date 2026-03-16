import cn from 'classnames';
import React from 'react';

import Loader from '../Loader';
import Text from '../Text';

import s from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  textView?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
};

const Button: React.FC<ButtonProps> = ({
  className,
  loading = false,
  children = null,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  textView = 'button',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={cn(
        s.button,
        s[`button_variant_${variant}`],
        s[`button_size_${size}`],
        isDisabled && s.button_disabled,
        fullWidth && s.button_fullWidth,
        className
      )}
      disabled={isDisabled}
    >
      {loading && <Loader className={s.button__loader} size="s" />}
      {iconLeft && <span className={s.button__iconLeft}>{iconLeft}</span>}
      {children != null && children !== '' && (
        <Text className={s.button__text} tag="span" view={textView}>
          {children}
        </Text>
      )}
      {iconRight && <span className={s.button__iconRight}>{iconRight}</span>}
    </button>
  );
};

export default Button;
