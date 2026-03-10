import Text from 'components/Text';
import LogoIcon from 'components/icons/LogoIcon';
import * as React from 'react';
import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import custom from 'styles/customStyles.module.scss';

import styles from './LogoBlock.module.scss';

const LogoBlock: React.FC = () => {
  const router = useRouter();

  const goToMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className={styles['logo-block']} onClick={goToMainPage}>
      <LogoIcon />
      <Text view="p-20" weight="bold" tag="span" className={custom['text-responsive']}>
        Lalasia
      </Text>
    </div>
  );
};

export default memo(LogoBlock);
