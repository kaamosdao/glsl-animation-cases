import { useRef } from 'react';
import gsap from 'gsap';

import useModal from '@/hooks';

import modalTypes from '@/utils/types';

import s from './Navigation.module.scss';

export default function Navigation() {
  const tl = useRef(null);
  const buttonRef = useRef(null);

  const { setModal } = useModal();

  const onMouseEnter = () => {
    tl.current = gsap
      .timeline({ repeat: -1 })
      .to(buttonRef?.current, {
        color: gsap.getProperty('html', '--purple'),
        duration: 0.9,
      })
      .to(buttonRef?.current, {
        color: gsap.getProperty('html', '--pink'),
        duration: 0.9,
      })
      .to(buttonRef?.current, {
        color: gsap.getProperty('html', '--red'),
        duration: 0.9,
      })
      .to(buttonRef?.current, {
        color: gsap.getProperty('html', '--gold'),
        duration: 0.9,
      })
      .to(buttonRef?.current, {
        color: gsap.getProperty('html', '--blue'),
        duration: 0.9,
      });
  };

  const onMouseLeave = (e) => {
    const button = e.currentTarget;

    tl.current?.kill();

    gsap.to(button, {
      color: '#2168b5',
      duration: 0.5,
    });
  };

  return (
    <nav className={s.nav}>
      <button
        ref={buttonRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => setModal(modalTypes.animationsList)}
        type="button"
        className={s.navButton}
      >
        animations
      </button>
    </nav>
  );
}
