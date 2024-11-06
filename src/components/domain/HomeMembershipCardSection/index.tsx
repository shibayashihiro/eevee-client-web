import { Center } from '@chakra-ui/react';

import { MembershipCard } from '@/components/domain/MemberShipCard';
import { containerMarginX } from '@/utils/constants';

import { HomeMembershipCardSectionPartsFragment } from './HomeMembershipCardSection.fragment.generated';

type Props = {
  membershipCardSection: HomeMembershipCardSectionPartsFragment;
};

export const HomeMembershipCardSection = ({ membershipCardSection }: Props) => {
  const { logo, membershipQRCodeData } = membershipCardSection;
  return (
    <Center w="full" py="16px" px={containerMarginX} bg="brand.primary">
      <MembershipCard logo={logo} qrCodeData={membershipQRCodeData} />
    </Center>
  );
};
