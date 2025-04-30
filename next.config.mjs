/** @type {import('next').NextConfig} */
const nextConfig = {
    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    // Configure image sources
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    // Ignore ESLint errors during build (we've downgraded them to warnings)
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Ignore TypeScript errors during build (optional)
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  