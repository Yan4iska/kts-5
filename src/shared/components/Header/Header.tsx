'use client';
import classNames from 'classnames';
import Button from 'components/Button';
import Container from 'components/Container';
import BurgerIcon from 'components/icons/BurgerIcon';
import * as React from 'react';
import { useEffect, useState } from 'react';
import custom from 'styles/customStyles.module.scss';

import styles from './Header.module.scss';
import LogoBlock from './LogoBlock';
import Menu from './Menu';
import RightBlock from './RightBlock';

export const Header: React.FC = () => {
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    if (burgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [burgerOpen]);

  return (
    <>
      <nav
        className={classNames({
          [styles['header']]: true,
          [custom['padding_hor']]: true,
        })}
      >
        <Container className={styles.header__desktop}>
          <LogoBlock />
          <Menu />
          <RightBlock />
        </Container>
        <div className={styles.header__mobile}>
          <div className={styles.header__mobileSpacer} />
          <div className={styles.header__logoWrap}>
            <LogoBlock />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={styles.header__burger}
            onClick={() => setBurgerOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={burgerOpen}
            iconLeft={<BurgerIcon width={24} height={24} />}
          />
        </div>
      </nav>

      <div
        className={classNames(styles.burgerBackdrop, burgerOpen && styles.burgerBackdrop_open)}
        onClick={() => setBurgerOpen(false)}
        aria-hidden
      />
      <div
        className={classNames(styles.burgerPanel, burgerOpen && styles.burgerPanel_open)}
        aria-hidden={!burgerOpen}
      >
        <Menu variant="burger" onNavigate={() => setBurgerOpen(false)} />
        <RightBlock />
      </div>
    </>
  );
};

export default Header;
