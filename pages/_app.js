import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import EaselPlugin from 'gsap/dist/EaselPlugin';

import RootLayout from '@/components/RootLayout';
import ReactSwitchTransition from '@/components/TransitionGroup';

import '@/styles/style.scss';

export default function App({ Component, pageProps }) {
  const pathName = usePathname();
  gsap.registerPlugin(EaselPlugin);

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
