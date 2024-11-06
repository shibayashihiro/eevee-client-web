import { FC } from 'react';
import { Box, Center, HStack, Text, Image } from '@chakra-ui/react';

import { SignUpBenefitBannerPartsFragment } from './SignUpBenefitBanner.fragment.generated';

export * from './SignUpBenefitBanner.fragment.generated';

type Props = {
  fragment: SignUpBenefitBannerPartsFragment;
};

export const SignUpBenefitBanner: FC<Props> = ({ fragment }) => {
  const { title } = fragment;
  return (
    <Box position="relative">
      <Image src="/assets/signup-benefit.png" alt="会員登録でクーポンプレゼント" w="full" objectFit="cover" />
      <Center w="full" h="full" position="absolute" top="2">
        <HStack>
          <Text className="bold" color="mono.white" fontSize="5xl">
            {title}
          </Text>
          <Text className="bold" color="mono.white" fontSize="xl" lineHeight="110%">
            クーポン
            <br />
            プレゼント
          </Text>
        </HStack>
      </Center>
    </Box>
  );
};
