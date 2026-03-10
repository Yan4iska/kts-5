import type { IconProps } from '../Icon';
import Icon from '../Icon';

const VectorIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} xmlns="http://www.w3.org/2000/svg" width="9" height="10" fill="#b5b6b7">
      <rect
        x="9"
        y="1.429"
        width="4.091"
        height="1.429"
        rx=".714"
        transform="rotate(180 9 1.429)"
      />
      &amp;gt;
      <rect
        x="9"
        y="5.714"
        width="6.545"
        height="1.429"
        rx=".714"
        transform="rotate(180 9 5.714)"
      />
      <rect x="9" y="10" width="9" height="1.429" rx=".714" transform="rotate(180 9 10)" />
    </Icon>
  );
};

export default VectorIcon;
