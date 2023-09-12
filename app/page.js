'use client';

import { useEffect, useRef } from 'react';

import Scene from '@/utils/Scene';

import images from '@/data/images';

import vShader from './_shaders/vertex.glsl';
import fShader from './_shaders/fragment.glsl';

import s from './page.module.scss';

export default function Home() {
  const scene = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    scene.current = new Scene(canvas.current, images, { vShader, fShader });

    window.addEventListener('resize', scene.current.resize);
    window.addEventListener('mousemove', scene.current.onMouseMove);
    window.addEventListener('click', scene.current.onClick);

    return () => {
      window.removeEventListener('resize', scene.current.resize);
      window.removeEventListener('mousemove', scene.current.onMouseMove);
      window.removeEventListener('click', scene.current.onClick);
      scene.current.dismiss();
    };
  }, []);

  return (
    <main className={s.main}>
      <div className={s.canvasHolder}>
        <canvas ref={canvas} />
      </div>
    </main>
  );
}
