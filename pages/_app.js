import RootLayout from '@/components/RootLayout';

import '@/styles/style.scss';

export default function App({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
