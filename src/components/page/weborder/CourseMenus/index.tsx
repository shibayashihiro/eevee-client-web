import { VStack, Text, Box } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { OrderType } from '@/graphql/generated/types';
import { CourseMenuCategoryListItem } from '@/components/domain/CourseMenuCategoryListItem';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { isFacility } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';

import { useGetCourseMenusPageQuery } from './CourseMenus.query.generated';

export const CourseMenusPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();
  const [{ data, fetching, error }] = useGetCourseMenusPageQuery({
    variables: {
      facilityId,
    },
  });
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  // 現状、コースメニューはイートインのみのため固定
  const orderType = OrderType.EatIn;

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (!data || !data.facility || !isFacility(data.facility)) {
    throw new Error('not found');
  }

  return (
    <FeatureFlagsProvider featureFlags={data.facility.featureFlags}>
      <NavigationHeaderLayout
        orderType={orderType}
        viewing={data?.viewing}
        viewer={data.viewer}
        facility={data.facility}
        disableHomeLink
      >
        <Box as="main" py="36px" px="20px">
          <Text className="mono-primary bold-3xl" mb="24px">
            ご来店ありがとうございます
          </Text>
          <VStack align="stretch" spacing="24px">
            {data.courseMenuCategories.map((category) => (
              <CourseMenuCategoryListItem key={category.id} category={category} />
            ))}
            {data.courseMenuCategories.length === 0 && <Text>表示できるメニューがありません。</Text>}
          </VStack>
        </Box>
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};
