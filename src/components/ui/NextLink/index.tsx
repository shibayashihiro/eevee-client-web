import NextLinkRaw from 'next/link';
import { ComponentProps } from 'react';

import { wrapUrl } from '@/utils/url';
import { useTenantIdentifier } from '@/providers/tenant/WebOrderPageStateProvider';

// 動的なbasepath(tenantIdentifier)を考慮したNextLinkを提供する
export const NextLink = ({ href, ...props }: ComponentProps<typeof NextLinkRaw>) => {
  const tenantIdentifier = useTenantIdentifier();
  const basePath = `/${tenantIdentifier}`;
  return <NextLinkRaw {...props} href={wrapUrl(href, basePath)} />;
};
