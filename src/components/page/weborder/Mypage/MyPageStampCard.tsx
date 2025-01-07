import { VStack, Center, Text, Badge, HStack, Icon, Spacer, LinkBox } from '@chakra-ui/react';
import React, { FC } from 'react';

import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { myPageStampCard as myStampCardPage } from '@/utils/paths/facilityPages';
import { TenantPageLinkOverlay } from '@/components/domain/TenantPageLink';

import { MyPageActiveStampCardFragment, MyPageStampCardFragment } from './MyPageStampCard.fragment.generated';
// import { PrimaryButton } from '@/components/ui/Button';
// import { QRCodeScanIcon } from '@/components/ui/Icons/QRCodeScanIcon';

type Props = {
  myPageStampCard: MyPageStampCardFragment;
};

export const MyPageStampCard: FC<Props> = ({ myPageStampCard: { loyaltyCard } }: Props) => {
  const facilityId = useFacilityId();
  const stampCardPage = myStampCardPage(facilityId);
  if (!loyaltyCard) {
    return null;
  }
  const { currentRank, activeStampCards } = loyaltyCard;
  return (
    <VStack spacing="16px" align="stretch">
      <StampHeader rankName={currentRank.name} color={currentRank.colorRGB} stampCardPage={stampCardPage} />
      <StampCard activeStampCards={activeStampCards} stampCardPage={stampCardPage} />
    </VStack>
  );
};

const StampHeader = ({
  rankName,
  color,
  stampCardPage,
}: {
  rankName: string;
  color: string;
  stampCardPage: string;
}) => {
  return (
    <HStack justify="space-between" w="full">
      <Badge bg={color} variant="subtle" borderRadius="4px">
        <Text fontSize="10px" className="bold-extra-small" color="mono.white" px="8px" py="4px">
          {rankName}ランク
        </Text>
      </Badge>
      <LinkBox>
        <TenantPageLinkOverlay href={stampCardPage}>
          <HStack>
            <Text fontSize="12px" color="brand.primaryText">
              スタンプカードの詳細をみる
            </Text>
            <Icon as={RightIcon} w="16px" h="16px" color="brand.primaryText" />
          </HStack>
        </TenantPageLinkOverlay>
      </LinkBox>
    </HStack>
  );
};

const StampCard = ({
  activeStampCards,
  stampCardPage,
}: {
  activeStampCards: MyPageActiveStampCardFragment[];
  stampCardPage: string;
}) => {
  const stampCard = activeStampCards[activeStampCards.length - 1];
  const currentPage = activeStampCards.length;
  // const handleScanQRCode = () => {
  //   if (liff.isInClient()) {
  //     liff.scanCodeV2().then((result) => {
  //       console.log('Scanned QR Code:', result.value);
  //     });
  //   } else {
  //     alert('QRコードスキャンはLINEアプリ内でのみ利用可能です。');
  //   }
  // };
  return (
    <LinkBox>
      <TenantPageLinkOverlay href={stampCardPage}>
        <Center bg="mono.backGroundLight" borderTopRadius="12px" p="20px" justifyContent="space-between">
          <VStack align="start">
            <Text className="text-micro" whiteSpace="nowrap" color="bold.secondary">
              スタンプ({currentPage}枚目)
            </Text>
            <HStack align="flex-end" my="8px">
              <Text
                className="bold-32px"
                whiteSpace="nowrap"
                lineHeight="70%"
                color="mono.primary"
                fontFamily="'SF Hiragino', sans-serif"
              >
                {stampCard.currentPoints}
              </Text>
              <Text className="bold-small" whiteSpace="nowrap" lineHeight="100%" color="mono.primary">
                / {stampCard.maxPointPerPage}個
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          {/* <PrimaryButton
              h="32px"
              w="min-content"
              borderRadius="22px"
              onClick={handleScanQRCode}
              bg="brand.primary"
              color="white"
              px="16px"
            >
              <QRCodeScanIcon boxSize="24px" mr="4px"/> QRコードを読み取る
            </PrimaryButton> */}
        </Center>
        <VStack bg="mono.backGround" borderBottomRadius="12px" align="stretch" spacing="4px" px="20px" py="16px">
          <Text className="text-micro" color="mono.secondary">
            プレゼント
          </Text>
          <Text className="text-extra-small" color="mono.primary">
            {stampCard.reward}
          </Text>
        </VStack>
      </TenantPageLinkOverlay>
    </LinkBox>
  );
};
