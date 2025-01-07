import { Image } from '@chakra-ui/react';

import { TenantPageLink } from '@/components/domain/TenantPageLink';

type Props = {
  imageUrl: string;
  homePath?: string;
};

export const Logo = ({ imageUrl, homePath }: Props) => {
  if (!homePath) {
    return <LogoImage imageUrl={imageUrl} />;
  }
  return (
    <TenantPageLink href={homePath} h="full">
      <LogoImage imageUrl={imageUrl} hasHomeLink={true} />
    </TenantPageLink>
  );
};

const LogoImage = ({ imageUrl, hasHomeLink }: { imageUrl: string; hasHomeLink?: boolean }) => (
  <Image src={imageUrl} alt={hasHomeLink ? 'ホームへ戻る' : ''} maxH="full" objectFit="contain" />
);
