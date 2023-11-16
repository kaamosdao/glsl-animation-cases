import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>kaamos</title>
        <meta name="description" content="Shader animations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
}
