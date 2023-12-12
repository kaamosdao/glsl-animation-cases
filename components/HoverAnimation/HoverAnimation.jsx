import { useRef, cloneElement } from 'react';
import gsap from 'gsap/dist/gsap';

export default function HoverAnimation({ children, color = '#2168b5' }) {
  const tl = useRef(null);

  const onMouseEnter = (e) => {
    const button = e.currentTarget;

    tl.current = gsap
      .timeline({ repeat: -1 })
      .to(button, {
        color: gsap.getProperty('html', '--purple'),
        duration: 0.9,
      })
      .to(button, {
        color: gsap.getProperty('html', '--pink'),
        duration: 0.9,
      })
      .to(button, {
        color: gsap.getProperty('html', '--red'),
        duration: 0.9,
      })
      .to(button, {
        color: gsap.getProperty('html', '--gold'),
        duration: 0.9,
      })
      .to(button, {
        color: gsap.getProperty('html', '--blue'),
        duration: 0.9,
      });
  };

  const onMouseLeave = (e) => {
    const button = e.currentTarget;

    tl.current?.kill();

    gsap.to(button, {
      color,
      duration: 0.5,
    });
  };

  return cloneElement(children, { onMouseEnter, onMouseLeave });
}
