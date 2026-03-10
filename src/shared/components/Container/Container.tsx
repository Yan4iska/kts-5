import clsx from 'clsx';
import type { FC, PropsWithChildren, ElementType } from 'react';

import styles from './Container.module.scss';

type ContainerSize = 'default' | 'small' | 'expand' | 'full';

type ContainerProps = {
  size?: ContainerSize;
  className?: string;
  as?: ElementType;
} & PropsWithChildren;

const Container: FC<ContainerProps> = ({
  children,
  size = 'default',
  className,
  as: Component = 'div',
}) => {
  return <Component className={clsx(styles.root, styles[size], className)}>{children}</Component>;
};
export default Container;
