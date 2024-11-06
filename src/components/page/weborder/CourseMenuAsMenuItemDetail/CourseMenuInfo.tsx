import { Text, Image, Box, Flex } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { NoImage } from '@/components/ui/NoImage';

import { CourseMenuAsMenuItemDetail_CourseMenuInfoFragment } from './CourseMenuInfo.fragment.generated';

type Props = {
  courseMenu: CourseMenuAsMenuItemDetail_CourseMenuInfoFragment;
};

export const CourseMenuInfo = ({ courseMenu }: Props) => {
  const { name, description } = courseMenu;
  return (
    <Flex direction="column" gap="16px">
      <Text className="bold-large" mx={containerMarginX}>
        {name}
      </Text>
      <Box>
        <Image
          src={undefined} // TODO: backendの実装でき次第
          alt="" // name で説明は果たせてるのでaltは明示的に空にする
          mt="16px"
          w="full"
          h={{ base: '249px', md: '426px' }}
          objectFit="cover"
          objectPosition={'50% 50%'}
          fallback={<NoImage h={{ base: '249px', md: '426px' }} w="full" />}
        />
      </Box>
      <Text mx={containerMarginX}>{description}</Text>
    </Flex>
  );
};
