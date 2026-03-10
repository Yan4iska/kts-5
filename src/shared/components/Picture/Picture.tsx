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
  const fallbackSrc = formats?.small?.url ?? formats?.thumbnail?.url ?? url ?? 'https://placehold.co/800x800';

  const src = largeSrc || mediumSrc || fallbackSrc;
  const alt = alternativeText ?? image.name ?? 'Product image';

  return (
    <div className={className}>
      <Image
        className={imgClassName}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        quality={90}
      />
    </div>
  );
});

Picture.displayName = 'Picture';

export default Picture;
