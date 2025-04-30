# Onramp Asset Availability

This project provides a UI for checking Coinbase Onramp Asset availability by country and state. Users can select their location to see which digital assets are available for purchase in their region.

Built with [Next.js](https://nextjs.org) and styled with Tailwind CSS.

## Deployment on Vercel

### Environment Variables Setup

When deploying to Vercel, you need to set up the following environment variables:

1. Public variables (available to the browser):
   - `NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID` - Your project ID
   - `NEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG` - Set to "smartWalletOnly"

2. Server-side variables (not exposed to the browser):
   - `ONCHAINKIT_API_KEY` - Your API key (stored securely, not with NEXT_PUBLIC prefix)

![Environment Variables Configuration](docs/env-vars-example.png)

### Important Security Note

Never use `NEXT_PUBLIC_` prefix for sensitive values like API keys, as this makes them visible in the client-side code. This application uses a secure server-side API route to keep your API key protected.

## Local Development

1. Clone the repository
2. Create `.env.local` file with the required environment variables
3. Run `npm install`
4. Run `npm run dev`

## Features

- Country and state selection
- Asset availability checking
- Responsive design
- Loading states for better user experience

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/components` - UI components for the application
- `app/svg` - SVG components for icons
- `app/page.tsx` - Main application page
- `app/providers.tsx` - React context providers

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Repository

The code is hosted on [GitHub](https://github.com/esteban-cb/onramp-asset-availability).
