import { createRef, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

import { useModal } from '@/hooks';

import s from './AnimationList.module.scss';

const pagesList = [
  { path: '/', label: 'Home', ref: createRef(null) },
  { path: '/swaying-buddha', label: 'Swaying Buddha', ref: createRef(null) },
  {
    path: '/underwater-cloudz',
    label: 'Underwater Cloudz',
    ref: createRef(null),
  },
];

export default function AnimationList() {
  const tl = useRef(null);

  const { setModal } = useModal();

  const onMouseEnter = (ref) => () => {
    tl.current = gsap
      .timeline({ repeat: -1 })
      .to(ref?.current, {
        color: gsap.getProperty('html', '--purple'),
        duration: 0.9,
      })
      .to(ref?.current, {
        color: gsap.getProperty('html', '--pink'),
        duration: 0.9,
      })
      .to(ref?.current, {
        color: gsap.getProperty('html', '--red'),
        duration: 0.9,
      })
      .to(ref?.current, {
        color: gsap.getProperty('html', '--gold'),
        duration: 0.9,
      })
      .to(ref?.current, {
        color: gsap.getProperty('html', '--blue'),
        duration: 0.9,
      });
  };

  const onMouseLeave = (ref) => () => {
    tl.current?.kill();

    gsap.to(ref?.current, {
      color: '#2168b5',
      duration: 0.5,
    });
  };

  const onClick = (e) => {
    e.stopPropagation();

    setModal(null);
  };

  return (
    <nav className={s.nav}>
      {pagesList.map(({ path, label, ref }) => (
        <Link
          ref={ref}
          key={path}
          onMouseEnter={onMouseEnter(ref)}
          onMouseLeave={onMouseLeave(ref)}
          onClick={onClick}
          className={s.navButton}
          href={path}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
