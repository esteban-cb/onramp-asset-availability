'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  // Get the API key from environment variables 
  // In a real app, this would be set properly in environment variables
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'your_api_key_here';

  return (
    <OnchainKitProvider
      apiKey={apiKey}
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

