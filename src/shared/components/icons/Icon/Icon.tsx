import cn from 'classnames';
import * as React from 'react';

import s from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  className,
  color,
  children,
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <svg
      {...props}
      className={cn(s['icon'], color && s[`icon_color-${color}`], className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
    >
      {children}
    </svg>
  );
};

export default Icon;
