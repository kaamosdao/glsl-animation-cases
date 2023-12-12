import { createRef } from 'react';
import Link from 'next/link';

import { useModal } from '@/hooks';

import HoverAnimation from '../HoverAnimation';

import s from './AnimationList.module.scss';

const pagesList = [
  { path: '/', label: 'Home', ref: createRef(null) },
  { path: '/swaying-buddha', label: 'Swaying Buddha', ref: createRef(null) },
  {
    path: '/underwater-cloudz',
    label: 'Underwater Cloudz',
    ref: createRef(null),
  },
  {
    path: '/flower-slider',
    label: 'Flower Slider',
    ref: createRef(null),
  },
];

export default function AnimationList() {
  const { setModal } = useModal();

  const closeNavigation = (e) => {
    e.stopPropagation();

    setModal(null);
  };

  return (
    <nav className={s.nav}>
      {pagesList.map(({ path, label, ref }) => (
        <HoverAnimation key={path}>
          <Link
            ref={ref}
            onClick={closeNavigation}
            className={s.navButton}
            href={path}
          >
            {label}
          </Link>
        </HoverAnimation>
      ))}
    </nav>
  );
}
