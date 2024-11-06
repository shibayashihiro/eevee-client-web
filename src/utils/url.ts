import { UrlObject } from 'url';

export type Url = UrlObject | string;

export const wrapUrl = (url: Url, basePath: string): Url => {
  if (typeof url === 'string') {
    return `${basePath}${url}`;
  }
  return {
    ...url,
    pathname: url.pathname ? `${basePath}${url.pathname}` : undefined,
    href: url.href ? `${basePath}${url.href}` : undefined,
  };
};
