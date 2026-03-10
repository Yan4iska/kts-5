import cn from 'classnames';
import * as React from 'react';

import s from './Text.module.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
  onClick?: () => void;
  id?: string;
};

const Text: React.FC<TextProps> = ({
  className,
  weight,
  tag: Tag = 'p',
  view = 'p-14',
  color,
  children,
  maxLines,
  id,
  onClick,
}) => {
  return (
    <Tag
      id={id}
      className={cn(
        s.text,
        s[`text_view-${view}`],
        weight && s[`text_weight-${weight}`],
        color && s[`text_color-${color}`],
        maxLines && s['text_multi-ellipsis'],
        className
      )}
      style={{ WebkitLineClamp: maxLines }}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default Text;
