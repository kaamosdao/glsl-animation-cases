'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap/dist/gsap';

import { useModal } from '@/hooks';

import AnimationList from '@/components/AnimationList';

import s from './Modal.module.scss';

const modals = {
  animationsList: <AnimationList />,
};

const Modal = () => {
  const modalRef = useRef(null);

  const { modal, setModal } = useModal();

  const [modalComponent, setModalComponent] = useState(null);

  useEffect(() => {
    if (modal) {
      setModalComponent(modals[modal]);
    }
  }, [modal]);

  useEffect(() => {
    if (modal) {
      gsap.to(modalRef?.current, {
        '--clipbrY': '100%',
        '--clipblY': '100%',
        duration: 1.0,
      });
    } else {
      gsap.to(modalRef?.current, {
        '--clipbrY': '0%',
        '--clipblY': '0%',
        duration: 1.0,
      });
    }
  }, [modalRef, modal]);

  return (
    <div
      className={s.modal}
      onClick={() => setModal(null)}
      aria-hidden="true"
      ref={modalRef}
    >
      {modalComponent}
    </div>
  );
};

export default Modal;
