import Image from 'next/image';
import * as React from 'react';
import type { StrapiImage } from 'types/product';

export type PictureProps = {
  image: StrapiImage;
  className?: string;
  imgClassName?: string;
};

const Picture: React.FC<PictureProps> = React.memo(({ image, className, imgClassName }) => {
  const { formats, alternativeText, url } = image;

  const largeSrc = formats?.large?.url ?? formats?.medium?.url ?? url;
  const mediumSrc = formats?.medium?.url ?? formats?.small?.url ?? url;
  const smallSrc = formats?.small?.url ?? formats?.thumbnail?.url ?? url;
  const thumbSrc = formats?.thumbnail?.url ?? smallSrc ?? url;

  const src = thumbSrc || url || 'https://placehold.co/360x360';
  const alt = alternativeText ?? image.name ?? 'Product image';

  return (
    <div className={className}>
      <Image
        className={imgClassName}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
      />
    </div>
  );
});

Picture.displayName = 'Picture';

export default Picture;
