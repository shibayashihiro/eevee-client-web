import { Box, VStack, HStack, Text, Avatar } from '@chakra-ui/react';
import liff from '@line/liff';

import { PencilIcon } from '@/components/ui/Icons/PencilIcon';
import { PrimaryButton } from '@/components/ui/Button';

type ProfileHeaderProps = {
  profileName: string;
  profileImage?: string;
  onEdit?: () => void;
};
export const LineAppProfileHeader = ({ profileName, profileImage, onEdit }: ProfileHeaderProps) => {
  if (!liff.isInClient()) return null;
  return (
    <Box position="relative" w="full" h="160px" overflow="hidden" bg="mono.white">
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="120px"
        bgImage={`url(${profileImage})`}
        bgSize="cover"
        bgPosition="center"
        filter="blur(20px)"
        zIndex={0}
      />
      <HStack spacing="4px" align="end" h="full" px="20px" zIndex={1}>
        <Avatar src={profileImage} size="xl" border="4px solid white" />
        <VStack align="start" spacing="4px" mb="4px" flex="1">
          <Text fontWeight="bold" color="mono.primary">
            {profileName}
          </Text>
        </VStack>
        <PrimaryButton w="24px" h="34px" rounded="50%" p="5px" onClick={onEdit}>
          <PencilIcon boxSize="24px" color="mono.white" />
        </PrimaryButton>
      </HStack>
    </Box>
  );
};
