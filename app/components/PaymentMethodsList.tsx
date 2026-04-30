'use client';

import { useMemo } from 'react';
import type { OnrampConfigResponseData } from '@coinbase/onchainkit/fund';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Icon } from '@coinbase/cds-web/icons';
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from '@coinbase/cds-web/tables';
import { Tag } from '@coinbase/cds-web/tag';
import { Text } from '@coinbase/cds-web/typography';

// Payment method display names
const PAYMENT_METHOD_NAMES: Record<string, string> = {
  UNSPECIFIED: 'Unspecified',
  CARD: 'Debit Card',
  ACH_BANK_ACCOUNT: 'ACH Bank Account',
  APPLE_PAY: 'Apple Pay',
  FIAT_WALLET: 'Fiat Wallet',
  CRYPTO_ACCOUNT: 'Crypto Account',
  GUEST_CHECKOUT_CARD: 'Guest Checkout - Debit Card',
  PAYPAL: 'PayPal',
  RTP: 'Real-Time Payments',
  GUEST_CHECKOUT_APPLE_PAY: 'Guest Checkout - Apple Pay',
};

const PAYMENT_METHOD_ICONS = {
  ACH_BANK_ACCOUNT: 'bank',
  APPLE_PAY: 'appleLogo',
  CARD: 'card',
  CRYPTO_ACCOUNT: 'crypto',
  FIAT_WALLET: 'wallet',
  GUEST_CHECKOUT_APPLE_PAY: 'appleLogo',
  GUEST_CHECKOUT_CARD: 'card',
  PAYPAL: 'paypal',
  RTP: 'cashUSD',
  UNSPECIFIED: 'payments',
} as const;

interface PaymentMethodsListProps {
  config: OnrampConfigResponseData | null;
  country: string;
}

export const PaymentMethodsList = ({ config, country }: PaymentMethodsListProps) => {
  const paymentMethods = useMemo(() => {
    if (!config?.countries) {
      return [];
    }

    const countryData = config.countries.find(c => c.id === country);

    if (!countryData?.paymentMethods) {
      return [];
    }

    return countryData.paymentMethods;
  }, [config, country]);

  if (!paymentMethods.length) {
    return (
      <Box background="bgWarningWash" borderRadius={200} padding={2}>
        <Text as="p" font="body" color="fgWarning" textAlign="center">
          No payment methods available for this location.
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text as="p" font="body" color="fgMuted">
          Available Payment Methods: {paymentMethods.length}
        </Text>
      </HStack>

      <Box overflow="auto">
        <Table variant="ruled" bordered compact accessibilityLabel="Available payment methods">
          <TableCaption>Available payment methods</TableCaption>
          <TableHeader>
            <TableRow backgroundColor="bgAlternate">
              <TableCell title="Payment Method" />
              <TableCell title="Type" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethods.map((method, index) => {
              const methodKey = method.id || 'UNSPECIFIED';
              const displayName = PAYMENT_METHOD_NAMES[methodKey] || methodKey;
              const iconName =
                PAYMENT_METHOD_ICONS[methodKey as keyof typeof PAYMENT_METHOD_ICONS] || 'payments';

              return (
                <TableRow key={`${methodKey}-${index}`}>
                  <TableCell
                    start={
                      <Box
                        background="bgPrimaryWash"
                        borderRadius={1000}
                        padding={1}
                      >
                        <Icon
                          name={iconName}
                          size="m"
                          color="fgPrimary"
                        />
                      </Box>
                    }
                    title={displayName}
                  />
                  <TableCell direction="horizontal">
                    <Tag colorScheme="blue">{methodKey}</Tag>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </VStack>
  );
};
