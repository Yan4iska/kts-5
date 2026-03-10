import Text from 'components/Text';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import { useRouter } from 'next/navigation';

import styles from './BackButton.module.scss';
const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div onClick={handleBack} className={styles['back-button']}>
      <ArrowDownIcon className={styles['back-button__icon']} />
      <Text view="p-20" color="primary">
        Назад
      </Text>
    </div>
  );
};

export default BackButton;
