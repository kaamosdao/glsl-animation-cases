import { useContext } from 'react';

import { PageTransitionContext } from '@/context';

const usePageTransition = () => useContext(PageTransitionContext);

export default usePageTransition;
