import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import Scene from '@/utils/home/Scene';
import { usePageTransition } from '@/hooks';

import s from './index.module.scss';

export default function Home() {
  const scene = useRef(null);
  const canvas = useRef(null);
  const canvasHolder = useRef(null);

  const isVisible = usePageTransition();

  useEffect(() => {
    scene.current = new Scene(canvas.current, [
      'enso-mask.png',
      'enso-sharp.png',
    ]);

    window.addEventListener('resize', scene.current.resize);
    // window.addEventListener('mousemove', scene.current.onMouseMove);
    // window.addEventListener('click', scene.current.onClick);

    return () => {
      window.removeEventListener('resize', scene.current.resize);
      // window.removeEventListener('mousemove', scene.current.onMouseMove);
      // window.removeEventListener('click', scene.current.onClick);
      scene.current.dismiss();
    };
  }, []);

  useEffect(() => {
    let animation;

    if (isVisible) {
      animation = gsap.timeline().to(canvasHolder?.current, {
        opacity: 1,
        duration: 1.0,
      });
    } else {
      animation = gsap.timeline().to(canvasHolder?.current, {
        opacity: 0,
        duration: 0.4,
      });
    }

    return () => {
      animation?.kill();
    };
  }, [canvasHolder, isVisible]);

  return (
    <div ref={canvasHolder} className={s.canvasHolder}>
      <canvas ref={canvas} />
    </div>
  );
}
