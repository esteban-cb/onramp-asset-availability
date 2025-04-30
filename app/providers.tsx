'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID || ''}
      chain={base}
      config={{ 
        appearance: { 
          mode: 'auto',
        }
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

