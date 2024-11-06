import { UrlObject } from 'url';

import Router from 'next/router';
import { ComponentProps, FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { resolveHref } from 'next/dist/client/resolve-href';

// ChakraUIのLink ComponentがUrlObjectを受け取れないため、vercelの関数を使ってstringに解決する。
// かなりハックぽいのでやめたい。（URLを作ってる箇所を全体的に直す必要あるのでいずれやりたい）
// https://github.com/vercel/next.js/discussions/22025
function resolveUrl(href: string | UrlObject): string | undefined {
  if (typeof href === 'string') {
    return href;
  }
  const [, resolvedAs] = resolveHref(Router, href, true);
  return resolvedAs;
}

export type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string | UrlObject;
  children: ReactNode;
};

/**
 * NextのLinkとChakraUIのLinkを共存させたLinkを提供します。（毎回書かなくていいように）
 * @param props
 * @returns
 */
export const WrappedLink: FC<Props> = (props: Props) => {
  const { href, children, ...otherProps } = props;
  return (
    <Link as={NextLink} href={resolveUrl(href)} {...otherProps}>
      {children}
    </Link>
  );
};
