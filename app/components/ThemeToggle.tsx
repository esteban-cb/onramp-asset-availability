'use client';

import { Button } from '@coinbase/cds-web/buttons';
import { Switch } from '@coinbase/cds-web/controls';
import { HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';
import { useThemePreference } from '@/app/providers';

export const ThemeToggle = () => {
  const { activeColorScheme, preference, setPreference } = useThemePreference();
  const isDarkMode = activeColorScheme === 'dark';

  const toggleTheme = () => {
    setPreference(isDarkMode ? 'light' : 'dark');
  };

  return (
    <VStack alignItems={{ base: 'flex-start', tablet: 'flex-end' }} gap={0.25}>
      <HStack alignItems="center" gap={1}>
        <Switch
          accessibilityLabel="Toggle dark mode"
          checked={isDarkMode}
          controlColor="bgPrimary"
          onChange={toggleTheme}
        >
          Dark mode
        </Switch>
        {preference !== 'system' && (
          <Button compact transparent variant="secondary" onClick={() => setPreference('system')}>
            Use system
          </Button>
        )}
      </HStack>
      <Text as="p" font="legal" color="fgMuted" textAlign={{ base: 'start', tablet: 'end' }}>
        {preference === 'system'
          ? `Following system (${activeColorScheme})`
          : `Using ${preference} mode`}
      </Text>
    </VStack>
  );
};
