import { useRouter } from 'next/router';
import { Box, Heading, VStack } from '@chakra-ui/react';

import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderType } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { NextPageWithLayout } from '@/types';
import { CourseMenuEntriesInput } from '@/components/domain/CourseMenuEntriesInput';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { courseMenusCartPage } from '@/utils/paths/facilityPages';
import { isCourseMenu, isFacility } from '@/graphql/helper';
import {
  putItems,
  selectCartItems,
  selectCartItemsTotalPrice,
  useCourseMenusCart,
  useCourseMenusCartDispatch,
} from '@/providers/CourseMenusCartProvider';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';
import {
  CourseMenuEntryMasterItem,
  useCourseMenuEntriesForm,
  CourseMenuEntriesFormProvider,
  useCourseMenuEntriesFormDispatch,
  selectSelectedEntriesAsCartItem,
} from '@/providers/CourseMenuEntriesFormProvider';
import { useSubmitCourseMenus } from '@/providers/CourseMenusCartProvider/useSubmitCourseMenus';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';

import { useGetSuggestedCourseMenusSelectPeoplePageQuery } from './SuggestedCourseMenusSelectPeople.query.generated';

export const SuggestedCourseMenusSelectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const courseMenuId = typeof router.query.courseMenuId === 'string' ? router.query.courseMenuId : '';
  const facilityId = useFacilityId();

  const [{ data, fetching, error }] = useGetSuggestedCourseMenusSelectPeoplePageQuery({
    variables: {
      facilityId,
      courseMenuId,
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
  if (!data?.courseMenu || !isCourseMenu(data.courseMenu) || !data.facility || !isFacility(data.facility)) {
    throw new Error('not found');
  }

  const {
    courseMenu: { suggestedCourses },
  } = data;

  const entriesForProvider: CourseMenuEntryMasterItem[] = [];
  for (const suggestedCourse of suggestedCourses) {
    for (const entry of suggestedCourse.entries) {
      entriesForProvider.push({
        courseMenuId: suggestedCourse.id,
        courseMenuName: suggestedCourse.name,
        courseMenuMinSelectCount: suggestedCourse.minSelectCount,
        ...entry,
      });
    }
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
          <Heading as="h2" className="mono-primary bold-3xl" fontSize="24px" mb="24px">
            こちらもいかがですか？
          </Heading>
          <CourseMenuEntriesFormProvider courseMenuEntries={entriesForProvider}>
            <VStack align="stretch" spacing="40px" mb="60px">
              {suggestedCourses.map((courseMenu) => (
                <CourseMenuEntriesInput
                  key={courseMenu.id}
                  heading={courseMenu.name}
                  description={courseMenu.description ?? undefined}
                  courseMenu={courseMenu}
                />
              ))}
              <ActionsButtons />
            </VStack>
          </CourseMenuEntriesFormProvider>
        </Box>
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

const ActionsButtons = () => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const tableId = useTableIdFromQuery();

  const { validate } = useCourseMenuEntriesFormDispatch();
  const formState = useCourseMenuEntriesForm();
  const selectedEntries = selectSelectedEntriesAsCartItem(formState);

  const dispatch = useCourseMenusCartDispatch();
  const cartState = useCourseMenusCart();
  const cartTotalPrice = selectCartItemsTotalPrice(cartState);

  const { loading, submitCourseMenus } = useSubmitCourseMenus({ facilityId, tableId });
  const onClickGoToCart = () => {
    if (!validate()) {
      return;
    }
    dispatch({
      type: 'PUT_ITEMS',
      items: selectedEntries,
    });
    router.push(courseMenusCartPage(facilityId, tableId));
  };

  const onClickStartOrder = async () => {
    if (!validate()) {
      return;
    }
    const newState = putItems(cartState, selectedEntries);
    await submitCourseMenus(selectCartItems(newState));
  };

  // 今選択中のコースと、すでにカートに入っているコースを含めて、有料のものがあるかどうかでボタンを変更する。
  const selectedEntriesPrice = selectedEntries.reduce((acc, entry) => acc + entry.price * entry.quantity, 0);
  const hasPricing = selectedEntriesPrice + cartTotalPrice > 0;

  const buttonText = hasPricing ? 'カートを見る' : '注文をはじめる';
  const onClick = hasPricing ? onClickGoToCart : onClickStartOrder;
  return (
    <VStack spacing="16px">
      <PrimaryButton h="56px" isLoading={loading} onClick={onClick}>
        {buttonText}
      </PrimaryButton>
      <SecondaryButton h="56px" onClick={() => router.back()}>
        戻る
      </SecondaryButton>
    </VStack>
  );
};
