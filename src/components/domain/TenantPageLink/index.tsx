import { ComponentProps, FC, useMemo } from 'react';
import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';

import { wrapUrl } from '@/utils/url';
import { useTenantIdentifier } from '@/providers/tenant/WebOrderPageStateProvider';
import { WrappedLink } from '@/components/ui/WrappedLink';

const useBasePath = () => {
  const tenantIdentifier = useTenantIdentifier();
  const basePath = `/${tenantIdentifier}`;
  return basePath;
};

type LinkProps = ComponentProps<typeof WrappedLink>;

export const TenantPageLink: FC<LinkProps> = (props: LinkProps) => {
  const { href, children, ...otherProps } = props;
  const basePath = useBasePath();
  const wrappedHref = useMemo(() => wrapUrl(href, basePath), [href, basePath]);
  return (
    <WrappedLink href={wrappedHref} {...otherProps}>
      {children}
    </WrappedLink>
  );
};

type OverlayProps = ComponentProps<typeof LinkOverlay>;

export const TenantPageLinkOverlay: FC<OverlayProps> = (props: OverlayProps) => {
  const { href, children, ...otherProps } = props;
  const basePath = useBasePath();
  const wrappedHref = href ? basePath + href : undefined;
  return (
    <LinkOverlay as={NextLink} href={wrappedHref} {...otherProps}>
      {children}
    </LinkOverlay>
  );
};
