import React, { FC } from 'react';
import { Box, HStack, Spacer } from '@chakra-ui/react';

import { ImageLink } from '@/components/ui/ImageLink';

type Props = {
  iosDownloadUrl: string;
  androidDownloadUrl: string;
};

export const AppDownloadLinks: FC<Props> = ({ iosDownloadUrl, androidDownloadUrl }: Props) => {
  return (
    <HStack spacing="0px">
      <Spacer />
      <ImageLink href={iosDownloadUrl} src="/assets/app_store.svg" alt="AppStore" h={{ base: '46px', md: '54px' }} />
      <Box width="10px" />
      <ImageLink
        href={androidDownloadUrl}
        src="/assets/google_play.svg"
        alt="GooglePlay"
        h={{ base: '46px', md: '54px' }}
      />
      <Spacer />
    </HStack>
  );
};
