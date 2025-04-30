'use client';

import { useState, useEffect } from 'react';
import type { OnrampConfigResponseData, OnrampOptionsResponseData } from '@coinbase/onchainkit/fund';
import { CountrySelector } from '@/app/components/CountrySelector';
import { StateSelector } from '@/app/components/StateSelector';
import { AssetList } from '@/app/components/AssetList';
import { Loading } from '@/app/components/Loading';

export default function Home() {
  const [config, setConfig] = useState<OnrampConfigResponseData | null>(null);
  const [options, setOptions] = useState<OnrampOptionsResponseData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<Error | null>(null);

  // Fetch config on component mount
  useEffect(() => {
    const getConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        setConfigError(null);
        
        console.log('Fetching configuration data...');
        
        // Use our secure API route instead of direct fetchOnrampConfig call
        const response = await fetch('/api/onchainkit?operation=getConfig', {
          // Add cache control to prevent stale data
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API error response:', errorData);
          throw new Error(
            errorData?.message || `Failed to fetch config (Status: ${response.status})`
          );
        }
        
        const configData = await response.json();
        
        console.log('Raw config data:', configData);
        
        if (!configData || !configData.countries || !Array.isArray(configData.countries)) {
          throw new Error('Invalid configuration data received');
        }
        
        setConfig(configData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching config:', error);
        setError('Failed to load country data. Please try again later.');
        setConfigError(error instanceof Error ? error : new Error('Unknown error'));
        setLoading(false);
      }
    };

    getConfig();
  }, []);

  // Retry function for config fetch error
  const retryConfigFetch = () => {
    setLoading(true);
    setError(null);
    setConfigError(null);
    // This will trigger the useEffect again
    setTimeout(() => {
      setLoading(false);
      setLoading(true);
    }, 100);
  };

  // Fetch options when country and state (if needed) are selected
  useEffect(() => {
    const getOptions = async () => {
      if (!selectedCountry) return;
      
      try {
        setLoadingAssets(true);
        setError(null);
        
        console.log(`Fetching asset options for ${selectedCountry}${selectedState ? ', ' + selectedState : ''}`);
        
        // Use our secure API route instead of direct fetchOnrampOptions call
        const url = new URL('/api/onchainkit', window.location.origin);
        url.searchParams.append('operation', 'getOptions');
        url.searchParams.append('country', selectedCountry);
        
        if (selectedCountry === 'US' && selectedState) {
          url.searchParams.append('subdivision', selectedState);
        }
        
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API error response:', errorData);
          throw new Error(
            errorData?.message || `Failed to fetch options (Status: ${response.status})`
          );
        }
        
        const optionsData = await response.json();
        
        console.log('Options data received');
        
        if (!optionsData) {
          throw new Error('Invalid options data received');
        }
        
        setOptions(optionsData);
        setLoadingAssets(false);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError(`Failed to load asset information: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    console.log(`Country changed to: ${country}`);
    setSelectedCountry(country);
    setSelectedState('');
    setOptions(null);
    setError(null);
  };

  const handleStateChange = (state: string) => {
    console.log(`State changed to: ${state}`);
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
            <p className="text-red-500 mb-4">{error}</p>
            {configError && (
              <div className="bg-red-900/30 p-3 rounded text-sm mb-4 text-left">
                <p className="font-mono">{configError.message}</p>
              </div>
            )}
            <button
              onClick={retryConfigFetch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
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
