import { Box, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderType } from '@/graphql/generated/types';
import { NextPageWithLayout } from '@/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { CourseMenuEntriesInput } from '@/components/domain/CourseMenuEntriesInput';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { courseMenusCartPage, courseMenusSuggestionsPage } from '@/utils/paths/facilityPages';
import {
  putItems,
  selectCartItems,
  useCourseMenusCart,
  useCourseMenusCartDispatch,
} from '@/providers/CourseMenusCartProvider';
import { isCourseMenu, isFacility } from '@/graphql/helper';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';
import {
  CourseMenuEntriesFormProvider,
  selectSelectedEntriesAsCartItem,
  useCourseMenuEntriesForm,
  useCourseMenuEntriesFormDispatch,
} from '@/providers/CourseMenuEntriesFormProvider';
import { useSubmitCourseMenus } from '@/providers/CourseMenusCartProvider/useSubmitCourseMenus';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';

import { useGetCourseMenuSelectPeoplePageQuery } from './CourseMenuSelectPeoplePage.query.generated';

export const CourseMenuSelectPeoplePage: NextPageWithLayout = () => {
  const router = useRouter();
  const cartState = useCourseMenusCart();
  const facilityId = useFacilityId();
  const courseMenuId = typeof router.query.courseMenuId === 'string' ? router.query.courseMenuId : '';

  const [{ data, fetching, error }] = useGetCourseMenuSelectPeoplePageQuery({
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
  if (!data?.courseMenu || !isCourseMenu(data.courseMenu) || !data?.facility || !isFacility(data.facility)) {
    throw new Error('not found');
  }

  const { courseMenu } = data;
  const entriesForProvider = courseMenu.entries.map((entry) => {
    const initialQuantity = cartState.byEntryId[entry.id]?.quantity;
    return {
      courseMenuId: courseMenu.id,
      courseMenuName: courseMenu.name,
      courseMenuMinSelectCount: courseMenu.minSelectCount,
      initialQuantity,
      ...entry,
    };
  });
  const hasSuggestions = courseMenu.suggestedCourses.length > 0;
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
            {courseMenu.name}
          </Heading>
          <CourseMenuEntriesFormProvider courseMenuEntries={entriesForProvider}>
            <VStack align="stretch" spacing="40px" mb="60px">
              <CourseMenuEntriesInput
                heading="ご利用人数"
                // メインのコース選択時にはdescription表示は不要で、代わりに固定の文言を表示する。
                description="ご一緒にいらっしゃる全員の人数を入力してください"
                courseMenu={courseMenu}
              />
              <ActionsButtons courseMenuId={courseMenuId} hasSuggestions={hasSuggestions} />
            </VStack>
          </CourseMenuEntriesFormProvider>
        </Box>
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

const ActionsButtons = ({ courseMenuId, hasSuggestions }: { courseMenuId: string; hasSuggestions: boolean }) => {
  const state = useCourseMenuEntriesForm();
  const { validate } = useCourseMenuEntriesFormDispatch();
  const dispatch = useCourseMenusCartDispatch();
  const selectedEntries = selectSelectedEntriesAsCartItem(state);
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const tableId = useTableIdFromQuery();

  const cartState = useCourseMenusCart();
  const { loading, submitCourseMenus } = useSubmitCourseMenus({ facilityId, tableId });

  const selectedEntriesPrice = selectedEntries.reduce((acc, entry) => acc + entry.price * entry.quantity, 0);
  // サジェストがなくて、有料コースもない場合は、すぐに注文を開始する
  const shouldStartOrder = !hasSuggestions && selectedEntriesPrice <= 0;

  const addEntriesToCart = () => {
    dispatch({
      type: 'PUT_ITEMS',
      items: selectedEntries,
    });
  };

  const handleClick = async () => {
    if (!validate()) {
      return;
    }
    addEntriesToCart();
    if (hasSuggestions) {
      router.push(courseMenusSuggestionsPage(facilityId, tableId, courseMenuId));
      return;
    }
    if (shouldStartOrder) {
      // 現在入力中のものと、すでにカートに入っているものを合わせて送信する
      await submitCourseMenus(selectCartItems(putItems(cartState, selectedEntries)));
      return;
    }
    router.push(courseMenusCartPage(facilityId, tableId));
  };

  return (
    <VStack spacing="16px">
      <PrimaryButton h="56px" isLoading={loading} onClick={handleClick}>
        {shouldStartOrder ? '注文をはじめる' : 'カートに追加'}
      </PrimaryButton>
      <SecondaryButton h="56px" onClick={() => router.back()}>
        戻る
      </SecondaryButton>
    </VStack>
  );
};
