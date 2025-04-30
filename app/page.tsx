'use client';

import { useState, useEffect } from 'react';
import { fetchOnrampConfig, fetchOnrampOptions } from '@coinbase/onchainkit/fund';
import type { OnrampConfigResponseData, OnrampOptionsResponseData } from '@coinbase/onchainkit/fund';
import { CountrySelector } from './components/CountrySelector';
import { StateSelector } from './components/StateSelector';
import { AssetList } from './components/AssetList';
import { Loading } from './components/Loading';

export default function Home() {
  const [config, setConfig] = useState<OnrampConfigResponseData | null>(null);
  const [options, setOptions] = useState<OnrampOptionsResponseData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch config on component mount
  useEffect(() => {
    const getConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use fetchOnrampConfig without API key, relying on OnchainKitProvider
        const configData = await fetchOnrampConfig();
        
        console.log('Raw config data:', JSON.stringify(configData, null, 2));
        setConfig(configData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching config:', error);
        setError('Failed to load country data. Please try again later.');
        setLoading(false);
      }
    };

    getConfig();
  }, []);

  // Fetch options when country and state (if needed) are selected
  useEffect(() => {
    const getOptions = async () => {
      if (!selectedCountry) return;
      
      try {
        setLoadingAssets(true);
        setError(null);
        
        // Use fetchOnrampOptions without API key, relying on OnchainKitProvider
        const optionsData = await fetchOnrampOptions({
          country: selectedCountry,
          subdivision: selectedCountry === 'US' ? selectedState : undefined,
        });
        
        console.log('Options data:', JSON.stringify(optionsData, null, 2));
        setOptions(optionsData);
        setLoadingAssets(false);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError('Failed to load asset information. Please try again.');
        setLoadingAssets(false);
      }
    };

    if (selectedCountry && (selectedCountry !== 'US' || selectedState)) {
      getOptions();
    } else {
      setOptions(null);
    }
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState('');
    setOptions(null);
    setError(null);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 relative">
      <h1 className="text-4xl font-bold mb-8">Coinbase Onramp Asset Availability Checker</h1>
      
      <div className="w-full max-w-4xl bg-white/5 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Select Location</h2>
        
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <CountrySelector 
              countries={config?.countries || []} 
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
            
            {selectedCountry === 'US' && (
              <StateSelector
                selectedState={selectedState}
                onStateChange={handleStateChange}
              />
            )}
          </div>
        )}
      </div>

      {loadingAssets ? (
        <div className="w-full max-w-4xl bg-white/5 rounded-lg p-6">
          <Loading />
        </div>
      ) : options ? (
        <div className="w-full max-w-4xl bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Assets</h2>
          <AssetList options={options} />
        </div>
      ) : error && selectedCountry && (selectedCountry !== 'US' || selectedState) ? (
        <div className="w-full max-w-4xl bg-white/5 rounded-lg p-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : null}
    </main>
  );
}
