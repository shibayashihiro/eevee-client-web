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

export const isExternalLink = (url: Url): boolean => {
  if (typeof url === 'string') {
    return isExternalLinkURL(url);
  }
  return isExternalLinkURL(url.href || '');
};

const isExternalLinkURL = (url: string): boolean => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  if (url.startsWith('//')) {
    return true;
  }
  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return true;
  }
  return false;
};
