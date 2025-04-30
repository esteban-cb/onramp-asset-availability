'use client';

import type { OnrampOptionsResponseData } from '@coinbase/onchainkit/fund';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

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
    // Log the options data to understand the structure
    console.log('Asset list options:', options);
    
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
    link.style.visibility = 'hidden';
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
      <div className="text-center py-4">
        <p className="text-yellow-500">No cryptocurrency assets are available in this location.</p>
      </div>
    );
  }

  return (
    <div>
      {paymentCurrencies.length > 0 && (
        <p className="mb-2">
          <span className="font-medium">Payment Currencies:</span>{' '}
          {paymentCurrencies.map((currency) => currency.id).join(', ')}
        </p>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <p>
          <span className="font-medium">Available Assets:</span> {purchaseCurrencies.length} 
          {filteredAssets.length !== purchaseCurrencies.length && 
            <span className="ml-2 text-sm text-blue-400">(Showing {filteredAssets.length})</span>
          }
        </p>
        <div className="flex gap-2">
          <button 
            onClick={clearFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm flex items-center"
            disabled={!assetFilter && !symbolFilter && !networkFilter}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Clear Filters
          </button>
          <button 
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="asset-filter" className="block text-sm font-medium mb-1">
            Filter by Asset Name
          </label>
          <input
            type="text"
            id="asset-filter"
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            placeholder="e.g. Bitcoin"
            className="w-full bg-white/75 border border-gray-300 rounded p-2"
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label htmlFor="symbol-filter" className="block text-sm font-medium mb-1">
            Filter by Symbol
          </label>
          <input
            type="text"
            id="symbol-filter"
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
            placeholder="e.g. BTC"
            className="w-full bg-white/75 border border-gray-300 rounded p-2"
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label htmlFor="network-filter" className="block text-sm font-medium mb-1">
            Filter by Network
          </label>
          <select
            id="network-filter"
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className={`w-full border border-gray-300 rounded p-2 ${networkFilter ? 'bg-blue-100' : 'bg-white/75'}`}
            style={{ color: 'black' }}
          >
            <option value="" style={{ backgroundColor: 'white', color: 'black' }}>All Networks</option>
            {availableNetworks.map((network) => (
              <option key={network} value={network} style={{ backgroundColor: 'white', color: 'black' }}>
                {network}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Asset</th>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Networks</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {asset.iconUrl && (
                        <Image 
                          src={asset.iconUrl} 
                          alt={asset.name} 
                          width={32}
                          height={32}
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                      )}
                      <div className="font-medium">{asset.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {asset.symbol}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {asset.networks.map((network) => (
                        <span 
                          key={network.chainId} 
                          className="text-xs bg-white/20 rounded px-2 py-1"
                        >
                          {network.displayName || network.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 