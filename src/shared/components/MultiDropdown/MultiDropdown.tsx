import cn from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '../Button';
import Input from '../Input';
import Text from '../Text';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import CloseIcon from '../icons/CloseIcon';

import s from './MultiDropdown.module.scss';

export type Option = {
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  disabled,
  onChange,
  getTitle,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLInputElement>(null);
  const closeButtonClickedRef = useRef(false);
  const [filter, setFilter] = useState('');
  const [isOpened, setIsOpened] = useState(false);

  const open = useCallback(() => {
    if (closeButtonClickedRef.current) {
      closeButtonClickedRef.current = false;
      return;
    }
    setIsOpened(true);
  }, []);

  const close = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeButtonClickedRef.current = true;
    setIsOpened(false);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpened(false);
      }
    };

    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  useEffect(() => {
    if (isOpened) {
      setFilter('');
    }
  }, [isOpened]);

  const title = useMemo(() => getTitle(value), [getTitle, value]);

  const isEmpty = value.length === 0;

  const filteredOptions = useMemo(() => {
    const str = (filter ?? '').toLocaleLowerCase();
    return options.filter((o) => (o?.value ?? '').toLocaleLowerCase().indexOf(str) === 0);
  }, [filter, options]);

  const selectedKeysSet = useMemo<Set<Option['key']>>(() => {
    return new Set(value.map(({ key }) => key));
  }, [value]);

  const onSelect = useCallback(
    (option: Option) => {
      if (disabled) {
        return;
      }

      if (selectedKeysSet.has(option.key)) {
        onChange([...value].filter(({ key }) => key !== option.key));
      } else {
        onChange([...value, option]);
      }

      ref.current?.focus();
    },
    [disabled, selectedKeysSet, onChange, value]
  );

  const opened = isOpened && !disabled;
  return (
    <div ref={wrapperRef} className={cn(className, s['multiDropdown'])}>
      <Input
        onClick={open}
        ref={ref}
        disabled={disabled}
        placeholder={title}
        className={s['multiDropdown__field']}
        value={opened ? filter : isEmpty ? '' : title}
        onChange={setFilter}
        afterSlot={
          opened ? (
            <Button
              variant="ghost"
              size="sm"
              className={s['multiDropdown__closeBtn']}
              onClick={close}
              aria-label="Close dropdown"
              iconLeft={<CloseIcon color="secondary" />}
            />
          ) : (
            <ArrowDownIcon color="secondary" />
          )
        }
      />
      {opened && (
        <div className={s['multiDropdown__options']}>
          {filteredOptions.map((option) => (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              textView="p-16"
              className={cn(
                s['multiDropdown__option'],
                selectedKeysSet.has(option.key) && s['multiDropdown__option_selected']
              )}
              key={option.key}
              onClick={() => onSelect(option)}
            >
              {option.value}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
