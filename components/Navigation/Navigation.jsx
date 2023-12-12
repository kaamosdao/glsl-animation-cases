import gsap from 'gsap';

import { useModal } from '@/hooks';

import modalTypes from '@/utils/types';

import HoverAnimation from '../HoverAnimation';

import s from './Navigation.module.scss';

export default function Navigation() {
  const { setModal } = useModal();

  return (
    <nav className={s.nav}>
      <div className={s.buttons}>
        <HoverAnimation color={gsap.getProperty('html', '--blue')}>
          <button
            onClick={() => setModal(modalTypes.animationsList)}
            type="button"
            className={s.navButton}
          >
            animations
          </button>
        </HoverAnimation>
        <HoverAnimation color={gsap.getProperty('html', '--blue')}>
          <button
            onClick={() => setModal(modalTypes.about)}
            type="button"
            className={s.navButton}
          >
            about
          </button>
        </HoverAnimation>
      </div>
    </nav>
  );
}
