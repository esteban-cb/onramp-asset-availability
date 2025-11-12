import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Coinbase Onramp Asset Availability',
  description: 'Check Coinbase Onramp Asset availability by country and state',
  verification: {
    google: 'I4SwnIeX_JET5qiPSPywvXY-4gaqTQrEd16qHzUqGVQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
