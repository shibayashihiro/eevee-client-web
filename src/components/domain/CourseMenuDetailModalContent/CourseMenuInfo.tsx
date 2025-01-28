import { Text, Image, VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { safeImage } from '@/utils/image';
import { NoImage } from '@/components/ui/NoImage';

import { CourseMenuAsMenuItemDetail_CourseMenuInfoFragment } from './CourseMenuInfo.fragment.generated';

type Props = {
  courseMenu: CourseMenuAsMenuItemDetail_CourseMenuInfoFragment;
};

export const CourseMenuInfo = ({ courseMenu }: Props) => {
  const { description } = courseMenu;
  return (
    <>
      <Image
        src={safeImage('undefined')} // TODO: backendの実装でき次第
        alt="" // name で説明は果たせてるのでaltは明示的に空にする
        mt="16px"
        w="full"
        h={{ base: '249px', md: '426px' }}
        objectFit="cover"
        objectPosition={'50% 50%'}
        fallback={<NoImage h={{ base: '249px', md: '426px' }} w="full" />}
      />
      <VStack align="stretch" px={containerMarginX} py="16px" spacing="16px">
        {description && (
          <Text className="text-small" whiteSpace="pre-line">
            {description}
          </Text>
        )}        
      </VStack>      
    </>
  );
};
