import cn from 'classnames';
import Image, { type StaticImageData } from 'next/image';
import React, { useState } from 'react';

import Text from '../Text';

import s from './Card.module.scss';

export const PLACEHOLDER_IMAGE = 'https://placehold.co/360x360';

function isValidImageSrc(image: string | StaticImageData): image is string {
  if (typeof image !== 'string') return false;
  if (!image.trim()) return false;
  try {
    new URL(image);
    return image.startsWith('http://') || image.startsWith('https://');
  } catch {
    return false;
  }
}

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL или статический импорт изображения */
  image: string | StaticImageData;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  onClick,
  actionSlot,
  title,
  contentSlot,
  subtitle,
}) => {
  const [imageError, setImageError] = useState(false);
  const usePlaceholder = imageError || (typeof image === 'string' && !image.trim());
  const useNextImage =
    !usePlaceholder && (typeof image !== 'string' || isValidImageSrc(image));
  const imageSrc = typeof image === 'string' && image.trim() ? image : PLACEHOLDER_IMAGE;
  const displaySrc = usePlaceholder ? PLACEHOLDER_IMAGE : (typeof image !== 'string' ? image : imageSrc);

  return (
    <div className={cn(className, s.card)} onClick={onClick}>
      <div className={s.card__header}>
        {useNextImage ? (
          <Image
            className={s['card__header-src']}
            src={displaySrc}
            alt=""
            fill
            sizes="(max-width: 400px) 100vw, 360px"
            onError={() => setImageError(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={s['card__header-src']}
            src={displaySrc}
            alt=""
          />
        )}
      </div>
      <div className={s.card__body}>
        {captionSlot && (
          <Text className={s.card__caption} view="p-14" weight="medium" color="secondary">
            {captionSlot}
          </Text>
        )}

        <div className={s.card__title_wrapper}>
          <Text maxLines={2} tag="h4" view="p-20" weight="medium" color="primary">
            {title}
          </Text>
        </div>

        <div className={s.card__subtitle_wrapper}>
          <Text maxLines={4} view="p-16" color="secondary">
            {subtitle}
          </Text>
        </div>

        <div className={s.card__footer}>
          {contentSlot && <div className={s.card__content}>{contentSlot}</div>}
          <div className={s.card__action}>{actionSlot}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
