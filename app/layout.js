import './_styles/style.scss';

export const metadata = {
  title: 'kaamos shaders',
  description: 'Shader animations',
  keywords: ['glsl', 'shader', 'threejs', 'animation'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
