'use client';

import { Select, type SelectOption } from '@coinbase/cds-web/alpha/select';
import { Icon } from '@coinbase/cds-web/icons';

type SelectFieldIconName = 'filter' | 'globe' | 'location';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption<string>[];
  placeholder: string;
  iconName: SelectFieldIconName;
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  iconName,
}: SelectFieldProps) => {
  return (
    <Select
      accessibilityLabel={label}
      className="cds-form-field"
      label={label}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={options}
      placeholder={placeholder}
      startNode={<Icon name={iconName} size="s" color="fgMuted" />}
      value={value || null}
    />
  );
};
