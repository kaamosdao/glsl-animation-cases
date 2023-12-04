/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.glsl$/,
        type: 'asset/source',
      }
    );

    return config;
  },
  eslint: {
    dirs: [
      'pages',
      'data',
      'utils',
      'components',
      'styles',
      'providers',
      'hooks',
      'context',
      'shaders',
    ],
  },
};

module.exports = nextConfig;
