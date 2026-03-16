import type { IconProps } from '../Icon';
import Icon from '../Icon';

const VectorIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      {...props}
      viewBox="0 0 9 10"
      width={9}
      height={10}
      fill="none"
      style={{ ...props.style, overflow: 'visible' }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 7.5L1.5 3.5h2V0h2v3.5h2L4.5 7.5z"
      />
    </Icon>
  );
};

export default VectorIcon;
