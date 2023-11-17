import Head from 'next/head';
import cn from 'classnames';

import { Roboto } from 'next/font/google';

import Navigation from '../Navigation/Navigation';

import s from './RootLayout.module.scss';

const font = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>kaamos</title>
        <meta name="description" content="Shader animations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(s.main, font.className)}>
        <Navigation />
        {children}
      </main>
    </>
  );
}
