import * as React from 'react';

import Icon, { type IconProps } from '../Icon';

const BurgerIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </Icon>
  );
};

export default BurgerIcon;
