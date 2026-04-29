'use client';

import { useState, useEffect } from 'react';
import type { OnrampConfigResponseData, OnrampOptionsResponseData } from '@coinbase/onchainkit/fund';
import { CountrySelector } from '@/app/components/CountrySelector';
import { StateSelector } from '@/app/components/StateSelector';
import { AssetList } from '@/app/components/AssetList';
import { PaymentMethodsList } from '@/app/components/PaymentMethodsList';
import { Loading } from '@/app/components/Loading';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Button } from '@coinbase/cds-web/buttons';
import { Icon } from '@coinbase/cds-web/icons';
import { Text } from '@coinbase/cds-web/typography';

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
          console.error('API error response', {
            status: response.status,
            message: errorData?.message,
          });
          throw new Error(
            errorData?.message || `Failed to fetch config (Status: ${response.status})`
          );
        }
        
        const configData = await response.json();

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
          console.error('API error response', {
            status: response.status,
            message: errorData?.message,
          });
          throw new Error(
            errorData?.message || `Failed to fetch options (Status: ${response.status})`
          );
        }

        const optionsData = await response.json();

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
    <Box
      as="main"
      minHeight="100vh"
      background="bg"
      color="fg"
      padding={{ base: 3, tablet: 6 }}
      display="flex"
      justifyContent="center"
    >
      <VStack gap={4} maxWidth="960px" width="100%">
        <Box
          as="header"
          width="100%"
          paddingX={{ base: 0, tablet: 1 }}
          paddingY={1}
        >
          <HStack
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            justifyContent="space-between"
          >
            <HStack alignItems="center" gap={1.5}>
              <Box background="bgPrimaryWash" borderRadius={1000} padding={1}>
                <Icon name="currencies" size="m" color="fgPrimary" active />
              </Box>
              <VStack gap={0.25}>
                <Text as="h1" font={{ base: 'title3', tablet: 'title1' }} color="fg">
                  Coinbase Onramp Asset Availability Checker
                </Text>
                <Text as="p" font="body" color="fgMuted">
                  Choose a location to see supported payment methods and assets.
                </Text>
              </VStack>
            </HStack>

            <ThemeToggle />
          </HStack>
        </Box>

        <Box
          width="100%"
          background="bgElevation1"
          borderColor="bgLine"
          borderRadius={400}
          borderWidth={100}
          elevation={1}
          padding={3}
        >
          <VStack className="cds-form-field" gap={3}>
            <Text as="h2" font="title3" color="fg">
              Select Location
            </Text>

            {loading ? (
              <Loading />
            ) : error ? (
              <VStack gap={2} alignItems="center" paddingY={2}>
                <Text as="p" font="body" color="fgNegative" textAlign="center">
                  {error}
                </Text>
                {configError && (
                  <Box
                    background="bgNegativeWash"
                    borderColor="bgNegative"
                    borderRadius={200}
                    borderWidth={100}
                    padding={2}
                    width="100%"
                  >
                    <Text as="p" fontFamily="body" font="label2" color="fgNegative">
                      {configError.message}
                    </Text>
                  </Box>
                )}
                <Button onClick={retryConfigFetch}>Retry</Button>
              </VStack>
            ) : (
              <VStack gap={3}>
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
              </VStack>
            )}
          </VStack>
        </Box>

        {config && selectedCountry ? (
          <Box
            width="100%"
            background="bgElevation1"
            borderColor="bgLine"
            borderRadius={400}
            borderWidth={100}
            elevation={1}
            padding={3}
          >
            <VStack className="cds-form-field" gap={3}>
              <Text as="h2" font="title3" color="fg">
                Available Payment Methods
              </Text>
              <PaymentMethodsList config={config} country={selectedCountry} />
            </VStack>
          </Box>
        ) : null}

        {loadingAssets ? (
          <Box
            width="100%"
            background="bgElevation1"
            borderColor="bgLine"
            borderRadius={400}
            borderWidth={100}
            elevation={1}
            padding={3}
          >
            <Loading />
          </Box>
        ) : options ? (
          <Box
            width="100%"
            background="bgElevation1"
            borderColor="bgLine"
            borderRadius={400}
            borderWidth={100}
            elevation={1}
            padding={3}
          >
            <VStack className="cds-form-field" gap={3}>
              <Text as="h2" font="title3" color="fg">
                Available Assets
              </Text>
              <AssetList options={options} />
            </VStack>
          </Box>
        ) : error && selectedCountry && (selectedCountry !== 'US' || selectedState) ? (
          <Box
            width="100%"
            background="bgElevation1"
            borderColor="bgLine"
            borderRadius={400}
            borderWidth={100}
            elevation={1}
            padding={3}
          >
            <Text as="p" font="body" color="fgNegative" textAlign="center">
              {error}
            </Text>
          </Box>
        ) : null}
      </VStack>
    </Box>
  );
}
