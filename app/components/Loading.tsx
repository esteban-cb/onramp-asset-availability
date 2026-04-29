'use client';

import { Box } from '@coinbase/cds-web/layout';
import { Spinner } from '@coinbase/cds-web/loaders';

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="center" paddingY={4}>
      <Spinner size={4} color="fgPrimary" accessibilityLabel="Loading" />
    </Box>
  );
};