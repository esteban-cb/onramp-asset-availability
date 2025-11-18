'use client';

import { useMemo } from 'react';
import type { OnrampConfigResponseData } from '@coinbase/onchainkit/fund';

// Payment method display names
const PAYMENT_METHOD_NAMES: Record<string, string> = {
  UNSPECIFIED: 'Unspecified',
  CARD: 'Credit/Debit Card',
  ACH_BANK_ACCOUNT: 'ACH Bank Account',
  APPLE_PAY: 'Apple Pay',
  FIAT_WALLET: 'Fiat Wallet',
  CRYPTO_ACCOUNT: 'Crypto Account',
  GUEST_CHECKOUT_CARD: 'Guest Checkout - Card',
  PAYPAL: 'PayPal',
  RTP: 'Real-Time Payments',
  GUEST_CHECKOUT_APPLE_PAY: 'Guest Checkout - Apple Pay',
};

interface PaymentMethodsListProps {
  config: OnrampConfigResponseData | null;
  country: string;
}

export const PaymentMethodsList = ({ config, country }: PaymentMethodsListProps) => {
  const paymentMethods = useMemo(() => {
    console.log('PaymentMethodsList - Full config:', config);
    console.log('PaymentMethodsList - Looking for country:', country);

    if (!config?.countries) {
      console.log('No countries in config');
      return [];
    }

    const countryData = config.countries.find(c => c.id === country);
    console.log('Found country data:', countryData);

    if (!countryData?.paymentMethods) {
      console.log('No payment methods for country');
      return [];
    }

    console.log('Payment methods:', countryData.paymentMethods);
    return countryData.paymentMethods;
  }, [config, country]);

  if (!paymentMethods.length) {
    return (
      <div className="text-center py-4">
        <p className="text-yellow-500">No payment methods available for this location.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p>
          <span className="font-medium">Available Payment Methods:</span> {paymentMethods.length}
        </p>
      </div>

      <div className="bg-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Payment Method</th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method, index) => {
                const methodKey = method.id || 'UNSPECIFIED';
                const displayName = PAYMENT_METHOD_NAMES[methodKey] || methodKey;

                return (
                  <tr key={`${methodKey}-${index}`} className="border-t border-gray-700">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          {methodKey === 'CARD' || methodKey === 'GUEST_CHECKOUT_CARD' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          ) : methodKey === 'ACH_BANK_ACCOUNT' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                          ) : methodKey.includes('APPLE_PAY') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                          ) : methodKey === 'PAYPAL' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8.32 21.97a.546.546 0 01-.26-.32c-.03-.15.06-.3.21-.41l.27-.18c1.32-.84 2.41-2.18 2.73-3.82.18-.93.16-1.88-.09-2.8a6.55 6.55 0 00-1.52-2.88c-.69-.77-1.57-1.38-2.53-1.77-.96-.38-2-.51-3.01-.36L3.5 9.2a.566.566 0 01-.47-.12.547.547 0 01-.18-.44l.87-5.5c.03-.18.18-.32.36-.32h7.84c2.79 0 4.95.77 6.31 2.25 1.36 1.48 1.82 3.62 1.35 6.23-.47 2.61-1.71 4.56-3.6 5.66-1.89 1.1-4.38 1.51-7.22 1.19l-.44-.06zm2.9-7.63c.47 0 .88-.17 1.19-.5.31-.33.52-.77.62-1.26.1-.5.06-.92-.12-1.23-.18-.31-.5-.47-.94-.47H9.73l-.56 3.46h2.05z"/>
                            </svg>
                          ) : methodKey === 'FIAT_WALLET' || methodKey === 'CRYPTO_ACCOUNT' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-100 text-blue-900 rounded-full px-3 py-1 font-mono font-semibold">
                        {methodKey}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
