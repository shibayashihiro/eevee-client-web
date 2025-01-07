import { FC, useCallback } from 'react';
import { Box, Text, Avatar, HStack, VStack } from '@chakra-ui/react';

import { BalloonToLeft } from '@/components/ui/BalloonToLeft';

import { OwnerCommentPartsFragment } from './OwnerComment.fragment.generated';

export * from './OwnerComment.fragment.generated';

type Props = {
  ownerComment: OwnerCommentPartsFragment;
  showNameLabel?: boolean;
};

export const OwnerComment: FC<Props> = ({ ownerComment, showNameLabel }) => {
  const { owner, comment } = ownerComment;

  // initialを表示したくないため削除する
  const getInitials = useCallback(() => '', []);

  return (
    <HStack alignItems={'center'}>
      <VStack textAlign={'center'}>
        <Avatar src={owner.icon} display="block" margin={'auto'} bg="mono.bg" getInitials={getInitials} />
        {owner.name && showNameLabel && <Text className="text-micro">{owner.name}</Text>}
      </VStack>
      <Box flex="auto" ml="4px">
        <BalloonToLeft>
          <Text className="bold-small">{comment}</Text>
        </BalloonToLeft>
      </Box>
    </HStack>
  );
};
