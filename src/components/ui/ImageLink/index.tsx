import { UrlObject } from 'url';

import { ComponentProps, FC } from 'react';
import Link from 'next/link';
import { Image, LinkBox, LinkOverlay } from '@chakra-ui/react';

export type Props = ComponentProps<typeof Image> & {
  href: string | UrlObject;
};

/**
 * Imageにリンクを貼りたい場合のユーティリティコンポーネント
 * @param props
 * @returns
 */
export const ImageLink: FC<Props> = (props: Props) => {
  const { href } = props;
  return (
    <LinkBox>
      <Link href={href} passHref>
        <LinkOverlay>
          <Image alt={props.alt} {...props} />
        </LinkOverlay>
      </Link>
    </LinkBox>
  );
};
