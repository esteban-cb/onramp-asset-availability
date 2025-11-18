import { NextRequest, NextResponse } from 'next/server';
import {
  fetchOnrampConfig as fetchConfig,
  fetchOnrampOptions as fetchOptions
} from '@coinbase/onchainkit/fund';

// The API key is only available on the server
const API_KEY = process.env.ONCHAINKIT_API_KEY || '';

// Mark this route as dynamic to address build warning
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const operation = searchParams.get('operation');

    console.log(`API Route called - Operation: ${operation}`);
    console.log(`Using API_KEY: ${API_KEY ? 'API key is set' : 'API key is missing'}`);

    if (operation === 'getConfig') {
      console.log('Fetching config...');
      // Set up fetch config request with the server-side API key
      // fetchConfig doesn't take an object, just provide the API key directly
      const configData = await fetchConfig(API_KEY);
      console.log('Config fetched successfully');
      return NextResponse.json(configData);
    } else if (operation === 'getBuyConfig') {
      const country = searchParams.get('country');

      console.log(`Fetching buy config for country: ${country || 'all countries'}`);

      // Fetch payment methods config from Coinbase API
      // This uses the direct API endpoint since onchainkit may not expose this
      const url = country
        ? `https://api.developer.coinbase.com/onramp/v1/buy/config?country=${country}`
        : 'https://api.developer.coinbase.com/onramp/v1/buy/config';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Buy config API error:', errorText);
        throw new Error(`Failed to fetch buy config: ${response.status} ${errorText}`);
      }

      const buyConfigData = await response.json();
      console.log('Buy config fetched successfully');
      return NextResponse.json(buyConfigData);
    } else if (operation === 'getOptions') {
      const country = searchParams.get('country');
      const subdivision = searchParams.get('subdivision');

      console.log(`Fetching options for country: ${country}, subdivision: ${subdivision || 'none'}`);

      if (!country) {
        return NextResponse.json(
          { error: 'Country parameter is required' },
          { status: 400 }
        );
      }

      // Set up fetch options request with the server-side API key
      const optionsData = await fetchOptions({
        country,
        subdivision: subdivision || undefined,
        apiKey: API_KEY
      });

      console.log('Options fetched successfully');
      return NextResponse.json(optionsData);
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API route error:', error);
    // Provide more detailed error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 