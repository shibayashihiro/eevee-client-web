import { Center, HStack, Text } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

import { MyPageMembershipCardFragment } from './MyPageMembershipCard.fragment.generated';

type Props = {
  user: MyPageMembershipCardFragment;
};

export const MyPageMembershipCard = ({ user }: Props) => {
  if (!user.membershipCard.membershipQRCodeData) {
    return null;
  }
  return (
    <Center bg="mono.white" borderRadius="8px" borderColor="mono.divider" borderWidth="0.5px" p="20px" pr="32px">
      <HStack align="center" w="full" p="16px" bg="mono.white" borderRadius="8px" justifyContent="space-between">
        <Text fontWeight="bold" color="mono.primary">
          会員証
        </Text>
        <QRCodeSVG value={user.membershipCard.membershipQRCodeData} size={88} />
      </HStack>
    </Center>
  );
};
