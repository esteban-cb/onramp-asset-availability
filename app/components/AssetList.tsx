'use client';

import type { OnrampOptionsResponseData } from '@coinbase/onchainkit/fund';
import { useEffect, useState, useMemo } from 'react';
import { Avatar } from '@coinbase/cds-web/media';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Button } from '@coinbase/cds-web/buttons';
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from '@coinbase/cds-web/tables';
import { Tag } from '@coinbase/cds-web/tag';
import { Text } from '@coinbase/cds-web/typography';
import { TextInput } from '@coinbase/cds-web/controls';

// Define the types based on the API documentation
interface PurchaseCurrency {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  networks: Network[];
}

interface Network {
  name: string;
  displayName: string;
  chainId: string;
  contractAddress: string;
}

interface PaymentCurrency {
  id: string;
  limits: {
    min?: string;
    max?: string;
    [key: string]: string | undefined;
  }[];
  iconUrl: string;
}

interface AssetListProps {
  options: OnrampOptionsResponseData;
}

export const AssetList = ({ options }: AssetListProps) => {
  const [purchaseCurrencies, setPurchaseCurrencies] = useState<PurchaseCurrency[]>([]);
  const [paymentCurrencies, setPaymentCurrencies] = useState<PaymentCurrency[]>([]);
  const [assetFilter, setAssetFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);

  useEffect(() => {
    // Extract assets and currencies from the API response
    try {
      const optionsData = options as OnrampOptionsResponseData;
      
      // Get the correct properties based on the OnrampOptionsResponseData type
      const purchaseCurrenciesData = optionsData.purchaseCurrencies || [];
      const paymentCurrenciesData = optionsData.paymentCurrencies || [];
      
      setPurchaseCurrencies(purchaseCurrenciesData as unknown as PurchaseCurrency[]);
      setPaymentCurrencies(paymentCurrenciesData as unknown as PaymentCurrency[]);

      // Extract unique networks for the filter dropdown
      const networks = new Set<string>();
      purchaseCurrenciesData.forEach((asset: PurchaseCurrency) => {
        asset.networks.forEach((network: Network) => {
          networks.add(network.displayName || network.name);
        });
      });
      setAvailableNetworks(Array.from(networks).sort());
    } catch (error) {
      console.error('Error parsing options data:', error);
      setPurchaseCurrencies([]);
      setPaymentCurrencies([]);
    }
  }, [options]);

  // Filter the assets based on the user's filter inputs
  const filteredAssets = useMemo(() => {
    return purchaseCurrencies.filter(asset => {
      // Filter by asset name
      const nameMatch = asset.name.toLowerCase().includes(assetFilter.toLowerCase());
      
      // Filter by symbol
      const symbolMatch = asset.symbol.toLowerCase().includes(symbolFilter.toLowerCase());
      
      // Filter by network
      const networkMatch = networkFilter === '' || asset.networks.some(
        network => (network.displayName || network.name).toLowerCase().includes(networkFilter.toLowerCase())
      );
      
      return nameMatch && symbolMatch && networkMatch;
    });
  }, [purchaseCurrencies, assetFilter, symbolFilter, networkFilter]);

  const exportToCSV = () => {
    const headers = ['Asset Name', 'Symbol', 'Networks'];
    const rows = filteredAssets.map(asset => {
      const networks = asset.networks.map(n => n.displayName || n.name).join(', ');
      return [asset.name, asset.symbol, networks];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'asset-availability.csv');
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setAssetFilter('');
    setSymbolFilter('');
    setNetworkFilter('');
  };

  if (!purchaseCurrencies.length) {
    return (
      <Box background="bgWarningWash" borderRadius={200} padding={2}>
        <Text as="p" font="body" color="fgWarning" textAlign="center">
          No cryptocurrency assets are available in this location.
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3}>
      {paymentCurrencies.length > 0 && (
        <Text as="p" font="body" color="fgMuted">
          Payment Currencies:{' '}
          {paymentCurrencies.map((currency) => currency.id).join(', ')}
        </Text>
      )}

      <HStack justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
        <HStack gap={1} alignItems="center" flexWrap="wrap">
          <Text as="p" font="body" color="fgMuted">
            Available Assets: {purchaseCurrencies.length}
          </Text>
          {filteredAssets.length !== purchaseCurrencies.length && (
            <Tag colorScheme="blue">Showing {filteredAssets.length}</Tag>
          )}
        </HStack>
        <HStack gap={1} flexWrap="wrap">
          <Button
            onClick={clearFilters}
            variant="secondary"
            compact
            disabled={!assetFilter && !symbolFilter && !networkFilter}
          >
            Clear Filters
          </Button>
          <Button
            onClick={exportToCSV}
            compact
          >
            Export to CSV
          </Button>
        </HStack>
      </HStack>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ base: '1fr', tablet: 'repeat(3, minmax(0, 1fr))' }}
      >
        <TextInput
          id="asset-filter"
          label="Filter by Asset Name"
          placeholder="e.g. Bitcoin"
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value)}
        />
        <TextInput
          id="symbol-filter"
          label="Filter by Symbol"
          placeholder="e.g. BTC"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
        />
        <VStack className="cds-form-field" gap={1}>
          <Text as="label" htmlFor="network-filter" font="label1" color="fg">
            Filter by Network
          </Text>
          <Box
            as="select"
            id="network-filter"
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className="cds-native-select"
            data-active={networkFilter ? 'true' : 'false'}
          >
            <option value="">All Networks</option>
            {availableNetworks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </Box>
        </VStack>
      </Box>

      <Box overflow="auto">
        <Table variant="ruled" bordered compact accessibilityLabel="Available assets">
          <TableCaption>Available assets</TableCaption>
          <TableHeader>
            <TableRow backgroundColor="bgAlternate">
              <TableCell title="Asset" />
              <TableCell title="Symbol" />
              <TableCell title="Networks" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell
                  start={<Avatar src={asset.iconUrl} name={asset.name} alt={asset.name} size="l" />}
                  title={asset.name}
                />
                <TableCell title={asset.symbol} />
                <TableCell>
                  <HStack gap={1} flexWrap="wrap">
                    {asset.networks.map((network) => (
                      <Tag key={`${network.chainId}-${network.name}`} colorScheme="gray">
                        {network.displayName || network.name}
                      </Tag>
                    ))}
                  </HStack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </VStack>
  );
};