'use client';

import { MediaQueryProvider, ThemeProvider } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <MediaQueryProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme="dark">
        <OnchainKitProvider
          projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID || ''}
          chain={base}
          config={{
            appearance: {
              mode: 'auto',
            },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}

