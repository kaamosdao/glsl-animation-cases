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

    scene.current.addResize();

    return scene.current.removeResize();
  }, []);

  return (
    <main className={s.main}>
      <div className={s.canvasHolder}>
        <canvas ref={canvas} />
      </div>
    </main>
  );
}
