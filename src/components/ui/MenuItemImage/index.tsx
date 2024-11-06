import { UrlObject } from 'url';

import { ComponentProps, FC } from 'react';
import { Image } from '@chakra-ui/react';

import { TenantPageLink } from '@/components/domain/TenantPageLink';

import { NoImage } from '../NoImage';

type Props = {
  href: string | UrlObject;
  image: string | undefined;
  name: string;
  boxSize: ComponentProps<typeof Image>['boxSize'];
};

const placeHolderImageName = 'img_placeholder_';

/**
 * @deprecated リンク付きのImage Componentというのがあまりイケてないので使わないようにする(やるならMenuItemに特化した方が良いがそれもできてない)
 * @param param0
 * @returns
 */
export const MenuItemImage: FC<Props> = ({ href, image, name, boxSize }: Props) => (
  <TenantPageLink href={href} style={{ textDecoration: 'none' }}>
    <Image
      // TODO: Imageがないときに白紙のデフォルト画像を返してきてしまうので、NoImage を表示できるように一旦無理くり変換している。
      src={image?.includes(placeHolderImageName) ? undefined : image}
      alt={name}
      boxSize={boxSize}
      fallback={<NoImage rounded="4px" boxSize={boxSize} />}
      rounded="4px"
      objectFit="cover"
    />
  </TenantPageLink>
);
