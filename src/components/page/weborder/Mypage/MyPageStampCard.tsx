import { VStack, Center, Text, Badge, HStack, Icon, Spacer, LinkBox } from '@chakra-ui/react';
import React, { FC } from 'react';
import liff from '@line/liff';

import { MyPageStampCardFragment } from '@/components/page/weborder/Mypage/MyPageStampCard.fragment.generated';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { myPageStampCard as myStampCardPage } from '@/utils/paths/facilityPages';
import { TenantPageLinkOverlay } from '@/components/domain/TenantPageLink';

type Props = {
  myPageStampCard: MyPageStampCardFragment | null;
};

export const MyPageStampCard: FC<Props> = ({ myPageStampCard }: Props) => {
  const stampCardPage = myStampCardPage(useFacilityId());

  if (
    !myPageStampCard ||
    !liff.isInClient() /* 現状、LINEユーザーしかユーザーを追跡できないので、スタンプカード機能はLIFFアプリの場合のみ表示する */
  ) {
    return null;
  }

  const { currentRank, activeStampCards } = myPageStampCard;
  return (
    <Center m="20px">
      <VStack spacing={0} align="stretch" w="full">
        <StampHeader rankName={currentRank.name} color={currentRank.colorRGB} stampCardPage={stampCardPage} />
        <StampCard activeStampCards={activeStampCards} stampCardPage={stampCardPage} />
      </VStack>
    </Center>
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
  activeStampCards: MyPageStampCardFragment['activeStampCards'];
  stampCardPage: string;
}) => {
  const stampCard = activeStampCards[activeStampCards.length - 1];
  const currentPage = activeStampCards.length;
  return (
    <>
      <LinkBox>
        <TenantPageLinkOverlay href={stampCardPage}>
          <Center
            bg="mono.backGroundLight"
            borderTopRadius="12px"
            p="20px"
            justifyContent="space-between"
            marginTop="16px"
          >
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
    </>
  );
};
