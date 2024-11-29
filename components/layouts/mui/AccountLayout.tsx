import React from 'react';
import MUIAppShell from '@/components/shared/mui/MUIAppShell';
import { SWRConfig } from 'swr';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
      }}
    >
      <MUIAppShell>{children}</MUIAppShell>
    </SWRConfig>
  );
}
