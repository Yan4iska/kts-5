import classNames from 'classnames';
import Text from 'components/Text';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import paths from 'config/paths';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import custom from 'styles/customStyles.module.scss';

import styles from './Menu.module.scss';

const isAuthenticated = () => {
  return false;
};

export type MenuVariant = 'default' | 'burger';

type MenuProps = {
  variant?: MenuVariant;
  onNavigate?: () => void;
};

const Menu: React.FC<MenuProps> = ({ variant = 'default', onNavigate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedUrl, setSelectedUrl] = useState(0);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const index = paths.findIndex((path) => path.url === pathname);
    if (index !== -1) {
      setSelectedUrl(index);
    }
  }, [pathname]);

  const goToPath = (index: number, url: string, authRequired = false) => {
    if (!authRequired || isAuthenticated()) {
      setSelectedUrl(index);
      router.push(url);
    } else {
      router.push('/login');
    }
  };

  if (variant === 'burger') {
    return (
      <div className={styles.menu_burger}>
        {paths.map((path) => (
          <Link
            key={path.name}
            href={path.url}
            onClick={onNavigate}
            className={classNames(
              styles.menu__option,
              styles.menu__option_burger,
              pathname === path.url && styles.menu__option_selected
            )}
          >
            <Text view="p-18" tag="span" className={custom['text-responsive']}>
              {path.name}
            </Text>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.menu}>
      <div className={styles.menu_small} ref={dropdownRef}>
        <div
          className={styles.menu_small__button}
          onClick={() => setVisible(!visible)}
          aria-expanded={visible}
          aria-haspopup="true"
        >
          <Text
            view="p-18"
            tag="div"
            className={[custom['text-responsive'], styles.menu_small__button__text].join(' ')}
          >
            Menu
          </Text>
          <ArrowDownIcon color="secondary" className={styles.menu_small__buttonIcon} />
        </div>

        {visible && (
          <div className={styles.menu_small__items}>
            {paths.map((path) => (
              <Link
                key={path.name}
                href={path.url}
                onClick={() => setVisible(false)}
                className={classNames(
                  styles.menu__option,
                  pathname === path.url && styles.menu__option_selected
                )}
              >
                <Text view="p-18" tag="span" className={custom['text-responsive']}>
                  {path.name}
                </Text>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.menu_big}>
        {paths.map((path, index) => {
          const handleClick = () => {
            goToPath(index, path.url, path.authRequired);
          };

          return (
            <Text
              key={path.name}
              className={classNames(
                styles.menu__option,
                selectedUrl === index && styles.menu__option_selected
              )}
              view="p-18"
              tag="div"
              onClick={handleClick}
            >
              {path.name}
            </Text>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
