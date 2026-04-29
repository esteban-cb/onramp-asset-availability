'use client';

import { MediaQueryProvider, ThemeProvider } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';
import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ColorScheme = 'light' | 'dark';
type ThemePreference = 'system' | ColorScheme;

interface ThemePreferenceContextValue {
  activeColorScheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const themePreferenceStorageKey = 'onramp-theme-preference';
const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === 'system' || value === 'light' || value === 'dark';
};

const getSystemColorScheme = (): ColorScheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemePreference = () => {
  const context = useContext(ThemePreferenceContext);

  if (!context) {
    throw new Error('useThemePreference must be used within Providers');
  }

  return context;
};

export function Providers(props: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    setSystemColorScheme(getSystemColorScheme());

    const storedPreference = window.localStorage.getItem(themePreferenceStorageKey);
    if (isThemePreference(storedPreference)) {
      setPreferenceState(storedPreference);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemPreferenceChange = (event: MediaQueryListEvent) => {
      setSystemColorScheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemPreferenceChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemPreferenceChange);
    };
  }, []);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    window.localStorage.setItem(themePreferenceStorageKey, nextPreference);
  }, []);

  const activeColorScheme = preference === 'system' ? systemColorScheme : preference;

  const themePreferenceContextValue = useMemo(
    () => ({
      activeColorScheme,
      preference,
      setPreference,
    }),
    [activeColorScheme, preference, setPreference],
  );

  return (
    <MediaQueryProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme={activeColorScheme}>
        <ThemePreferenceContext.Provider value={themePreferenceContextValue}>
          <OnchainKitProvider
            projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID || ''}
            chain={base}
            config={{
              appearance: {
                mode: activeColorScheme,
              },
            }}
          >
            {props.children}
          </OnchainKitProvider>
        </ThemePreferenceContext.Provider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}

