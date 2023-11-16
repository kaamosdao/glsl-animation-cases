'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EaselPlugin } from 'gsap/dist/EaselPlugin';

import Scene from '@/utils/underwater-cloudz/Scene';

import images from '@/data/images';

import vShader from './_shaders/vertex.glsl';
import fShader from './_shaders/fragment.glsl';

import s from './index.module.scss';

export default function Home() {
  const scene = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(EaselPlugin);
  }, []);

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
