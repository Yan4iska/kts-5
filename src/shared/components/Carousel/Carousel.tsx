import classNames from 'classnames';
import Picture from 'components/Picture';
import useEmblaCarousel from 'embla-carousel-react';
import type { StrapiImage } from 'types/product';

import styles from './Carousel.module.scss';

export type CarouselProps = {
  className?: string;
  images: StrapiImage[];
};

const Carousel: React.FC<CarouselProps> = ({ images, className }) => {
  const [emblaRef] = useEmblaCarousel({
    loop: images.length > 1,
  });

  if (!images.length) {
    return null;
  }

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {images.map((image) => (
            <div className={styles.slide} key={image.documentId || String(image.id)}>
              <Picture image={image} className={styles.picture} imgClassName={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
