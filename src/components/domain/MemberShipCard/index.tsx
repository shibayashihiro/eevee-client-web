import { Center, HStack, Image, VStack } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

export const MembershipCard = ({ logo, qrCodeData }: { logo: string; qrCodeData: string }) => {
  return (
    <HStack align="center" w="full" p="16px" bg="mono.white" borderRadius="8px" justifyContent="space-around">
      <VStack spacing="16px">
        <Image src={logo} maxW="155px" alt="ブランドロゴ画像" objectFit="cover" />
        {/* TODO: カメラ起動機能を追加したらボタン表示 */}
        {/* <PrimaryButton h="32px" w="full" borderRadius="22px">
                QRコードを読み取る
            </PrimaryButton> */}
      </VStack>
      <Center p="8px">
        <QRCodeSVG value={qrCodeData} size={136} />
      </Center>
    </HStack>
  );
};
