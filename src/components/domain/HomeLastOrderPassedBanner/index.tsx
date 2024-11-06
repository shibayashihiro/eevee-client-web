import { VStack, Text } from '@chakra-ui/react';

import { isAfter } from '@/utils/date';

import { HomeLastOrderPassedBannerFragment } from './HomeLastOrderPassedBanner.fragment.generated';

type Props = {
  courseMenu: HomeLastOrderPassedBannerFragment;
};

export const HomeLastOrderPassedBanner = ({ courseMenu }: Props) => {
  const {
    lastOrderAt,
    courseMenu: { name: courseName },
  } = courseMenu;

  if (!lastOrderAt) {
    return null;
  }

  const now = new Date();
  const lastOrderAtDate = new Date(lastOrderAt);
  if (!isAfter(now, lastOrderAtDate)) {
    return null;
  }

  return (
    <VStack align="stretch" p="16px" borderRadius="8px" spacing="4px" bg="brand.backgroundSoft">
      <Text className="bold-large" color="brand.primaryText">
        {courseName}が終了しました
      </Text>
    </VStack>
  );
};
