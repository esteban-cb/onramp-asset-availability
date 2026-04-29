'use client';

import { useState, useEffect } from 'react';
import { SelectField } from '@/app/components/SelectField';

interface CountryData {
  id: string;
  [key: string]: unknown;
}

interface CountrySelectorProps {
  countries: CountryData[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const CountrySelector = ({ 
  countries, 
  selectedCountry, 
  onCountryChange 
}: CountrySelectorProps) => {
  const [sortedCountries, setSortedCountries] = useState<CountryData[]>([]);
  
  useEffect(() => {
    if (!countries || countries.length === 0) {
      setSortedCountries([]);
      return;
    }
    
    try {
      // Sort countries alphabetically by id
      const sorted = [...countries].sort((a, b) => {
        // Check if a and b exist
        if (!a || !b) return 0;
        
        // Based on the OnrampConfigCountry type, use id as the country code
        const aId = a.id || '';
        const bId = b.id || '';
        
        // Sort by id (country code)
        return aId.localeCompare(bId);
      });
      
      setSortedCountries(sorted);
    } catch (error) {
      console.error('Error sorting countries:', error);
      setSortedCountries(countries);
    }
  }, [countries]);

  return (
    <SelectField
      label="Select Country"
      value={selectedCountry}
      onChange={onCountryChange}
      iconName="globe"
      placeholder="-- Select a country --"
      options={sortedCountries.map((country) => {
        // Based on the type definitions, use id as the country code
        const code = country.id || '';
        // Use the country code as the display name since the API doesn't seem to provide a name
        const displayName = getCountryName(code) || code;

        return {
          value: code,
          label: displayName,
          disabled: !code,
        };
      })}
    />
  );
};

// Helper function to get country name from country code
function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    "US": "United States",
    "CA": "Canada",
    "MX": "Mexico",
    "GB": "United Kingdom",
    "DE": "Germany",
    "FR": "France",
    "ES": "Spain",
    "IT": "Italy",
    "AU": "Australia",
    "JP": "Japan",
    "CN": "China",
    "IN": "India",
    "BR": "Brazil",
    "AR": "Argentina",
    "ZA": "South Africa",
    "NG": "Nigeria",
    "EG": "Egypt",
    "SA": "Saudi Arabia",
    "AE": "United Arab Emirates",
    "RU": "Russia",
    "KR": "South Korea",
    "SG": "Singapore",
    "HK": "Hong Kong",
    "NZ": "New Zealand",
    // Add more countries as needed
  };

  return countries[countryCode] || countryCode;
}