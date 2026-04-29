'use client';

import type { ReactNode } from 'react';
import { Box, HStack, VStack } from '@coinbase/cds-web/layout';
import { Icon } from '@coinbase/cds-web/icons';
import { Text } from '@coinbase/cds-web/typography';

type SelectFieldIconName = 'filter' | 'globe' | 'location';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  iconName: SelectFieldIconName;
  active?: boolean;
}

export const SelectField = ({
  id,
  label,
  value,
  onChange,
  children,
  iconName,
  active = false,
}: SelectFieldProps) => {
  return (
    <VStack className="cds-form-field" gap={1}>
      <HStack alignItems="center" gap={1}>
        <Icon name={iconName} size="s" color="fgMuted" />
        <Text as="label" htmlFor={id} font="label1" color="fg">
          {label}
        </Text>
      </HStack>
      <Box position="relative" width="100%">
        <Box
          as="select"
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="cds-native-select"
          data-active={active ? 'true' : 'false'}
        >
          {children}
        </Box>
        <Box className="cds-native-select-icon" aria-hidden="true">
          <Icon name="caretDown" size="s" color="fgMuted" />
        </Box>
      </Box>
    </VStack>
  );
};
