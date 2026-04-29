'use client';

import { Box } from '@coinbase/cds-web/layout';
import { ProgressCircle } from '@coinbase/cds-web/visualizations';

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="center" paddingY={4}>
      <ProgressCircle
        indeterminate
        accessibilityLabel="Loading"
        color="fgPrimary"
        hideContent
        size={40}
      />
    </Box>
  );
};
