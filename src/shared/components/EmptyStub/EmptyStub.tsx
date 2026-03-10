import Text from 'components/Text';
import cn from 'classnames';
import type React from 'react';

import styles from './EmptyStub.module.scss';

export type EmptyStubProps = {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actionSlot?: React.ReactNode;
};

const EmptyStub: React.FC<EmptyStubProps> = ({
  className,
  title = 'Nothing found',
  description = 'Try changing filters or search query.',
  actionSlot,
}) => {
  return (
    <div className={cn(styles['empty-stub'], className)}>
      <Text tag="h2" view="title" className={styles['empty-stub__title']}>
        {title}
      </Text>
      <Text tag="p" view="p-20" color="secondary" className={styles['empty-stub__description']}>
        {description}
      </Text>
      {actionSlot && <div className={styles['empty-stub__action']}>{actionSlot}</div>}
    </div>
  );
};

export default EmptyStub;

