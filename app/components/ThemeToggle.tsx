'use client';

import { Button } from '@coinbase/cds-web/buttons';
import { Switch } from '@coinbase/cds-web/controls';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Text } from '@coinbase/cds-web/typography';
import { useThemePreference } from '@/app/providers';

export const ThemeToggle = () => {
  const { activeColorScheme, preference, setPreference } = useThemePreference();
  const isDarkMode = activeColorScheme === 'dark';

  const toggleTheme = () => {
    setPreference(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Box
      background="bgAlternate"
      borderColor="bgLine"
      borderRadius={300}
      borderWidth={100}
      padding={1.5}
    >
      <VStack alignItems="center" gap={0.5}>
        <HStack alignItems="center" gap={1.5}>
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
        <Text as="p" font="legal" color="fgMuted" textAlign="center">
          {preference === 'system'
            ? `Following system (${activeColorScheme})`
            : `Using ${preference} mode`}
        </Text>
      </VStack>
    </Box>
  );
};
