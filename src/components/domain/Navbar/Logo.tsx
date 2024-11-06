import { Image } from '@chakra-ui/react';

import { TenantPageLink } from '../TenantPageLink';

type Props = {
  imageUrl: string;
  homePath?: string;
};

export const Logo = ({ imageUrl, homePath }: Props) => {
  if (!homePath) {
    return <LogoImage imageUrl={imageUrl} />;
  }
  return (
    <TenantPageLink href={homePath}>
      <LogoImage imageUrl={imageUrl} />
    </TenantPageLink>
  );
};

const LogoImage = ({ imageUrl }: { imageUrl: string }) => (
  <Image src={imageUrl} alt="Logo" h="36px" objectFit="cover" />
);
