'use client';

import { useMemo, useState } from 'react';
import { Transition } from 'react-transition-group';

import ModalContext from '@/context/ModalContext';
import Modal from '@/components/Modal';

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(false);
  const value = useMemo(() => ({ modal, setModal }), [modal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Transition in={!!modal} timeout={1000} unmountOnExit>
        <Modal />
      </Transition>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
