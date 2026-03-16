'use client';

import classNames from 'classnames';
import Picture from 'components/Picture';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { StrapiImage } from 'types/product';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import styles from './ProductGallery.module.scss';

export type ProductGalleryProps = {
  className?: string;
  images: StrapiImage[];
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, className }) => {
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const setThumbsRef = useCallback((swiper: SwiperType | null) => {
    if (swiper && !swiper.destroyed) {
      setThumbsSwiper(swiper);
    } else {
      setThumbsSwiper(null);
    }
  }, []);

  const setMainRef = useCallback((swiper: SwiperType | null) => {
    mainSwiperRef.current = swiper;
  }, []);

  useEffect(() => {
    if (mainSwiperRef.current && thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideTo(activeIndex);
    }
  }, [thumbsSwiper, activeIndex]);

  const handleMainSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.activeIndex);
      thumbsSwiper?.slideTo(swiper.activeIndex);
    },
    [thumbsSwiper]
  );

  const handleThumbClick = useCallback((index: number) => {
    mainSwiperRef.current?.slideTo(index);
  }, []);

  if (!images.length) {
    return null;
  }

  return (
    <motion.div
      className={classNames(styles.root, className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.mainColumn}>
        {mounted ? (
          <Swiper
            key="product-gallery-main"
            onSwiper={setMainRef}
            onSlideChange={handleMainSlideChange}
            spaceBetween={0}
            navigation
            modules={[Navigation]}
            className={styles.mainSwiper}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`gallery-main-${index}`} className={styles.mainSlide}>
                <div className={styles.mainImageWrap}>
                  <Picture
                    image={image}
                    className={styles.mainPicture}
                    imgClassName={styles.mainImage}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={styles.mainSwiperPlaceholder}>
            <div className={styles.mainImageWrap}>
              <Picture
                image={images[0]}
                className={styles.mainPicture}
                imgClassName={styles.mainImage}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.thumbsColumn}>
        <Swiper
          key="product-gallery-thumbs"
          onSwiper={setThumbsRef}
          direction="horizontal"
          spaceBetween={8}
          slidesPerView="auto"
          freeMode
          watchSlidesProgress
          slideToClickedSlide
          modules={[FreeMode]}
          className={styles.thumbsSwiper}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={`gallery-thumb-${index}`}
              className={classNames(styles.thumbSlide, activeIndex === index && styles.thumbActive)}
              onClick={() => handleThumbClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleThumbClick(index);
                }
              }}
            >
              <div className={styles.thumbImageWrap}>
                <Picture
                  image={image}
                  className={styles.thumbPicture}
                  imgClassName={styles.thumbImage}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  );
};

export default ProductGallery;
