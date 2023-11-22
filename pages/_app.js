import { usePathname } from 'next/navigation';

import RootLayout from '@/components/RootLayout';
import ReactSwitchTransition from '@/components/TransitionGroup';

import '@/styles/style.scss';

export default function App({ Component, pageProps }) {
  const pathName = usePathname();

  return (
    <RootLayout>
      <ReactSwitchTransition
        transitionKey={pathName}
        timeout={{ exit: 400 }}
        mode="out-in"
      >
        <Component {...pageProps} />
      </ReactSwitchTransition>
    </RootLayout>
  );
}
