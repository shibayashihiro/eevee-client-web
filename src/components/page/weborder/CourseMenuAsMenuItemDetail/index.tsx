import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderType, TaxRateType } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { generateMutationId, isCourseMenu, isFacility } from '@/graphql/helper';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import {
  CourseMenuEntriesFormProvider,
  CourseMenuEntryMasterItem,
  selectSelectedEntriesAsCartItem,
  useCourseMenuEntriesForm,
  useCourseMenuEntriesFormDispatch,
} from '@/providers/CourseMenuEntriesFormProvider';
import { containerMarginX } from '@/utils/constants';
import variables from '@/styles/variables.module.scss';
import { PrimaryButton } from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatUtils';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useHomePath } from '@/hooks/domain/useHomePath';
import { cartPage } from '@/utils/paths/facilityPages';
import { FeatureFlagsProvider, useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { getPriceExcludingTax, taxRoundTypes } from '@/utils/domain/tax';

import { useGetCourseMenuForMenuItemDetailQuery } from './CourseMenuAsMenuItemDetail.query.generated';
import { CourseMenuInfo } from './CourseMenuInfo';
import { CourseMenuEntriesInput } from './CourseMenuEntriesInput';
import { useAddCourseMenuMutation, useUpdateCourseMenuMutation } from './CourseMenuAsMenuItemDetail.mutation.generated';

// コースメニューは現状、EatInのみ対応
const orderType = OrderType.EatIn;

const isArrayInQuery = (value: string | string[]): value is string[] => {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
};

// queryパラメータを参照して、entryId: quantity の形式を返す
const getInitialQuantitiesFromQuery = (query: ParsedUrlQuery): { [entryId: string]: number } | null => {
  const { selectedEntryIds, selectedEntryQuantities } = query;
  if (!selectedEntryIds || !selectedEntryQuantities) {
    return null;
  }

  // NOTE: 1個の場合はstringになる
  if (typeof selectedEntryIds === 'string' && typeof selectedEntryQuantities === 'string') {
    const quantity = parseInt(selectedEntryQuantities, 10);
    return {
      [selectedEntryIds]: !isNaN(quantity) ? quantity : 0,
    };
  }

  if (!isArrayInQuery(selectedEntryIds) || !isArrayInQuery(selectedEntryQuantities)) {
    return null;
  }
  if (selectedEntryIds.length !== selectedEntryQuantities.length) {
    return null;
  }
  const result: { [entryId: string]: number } = {};
  for (let i = 0; i < selectedEntryIds.length; i++) {
    const entryId = selectedEntryIds[i];
    const quantityStr = selectedEntryQuantities[i] ?? 0;
    const quantity = parseInt(quantityStr, 10);
    result[entryId] = !isNaN(quantity) ? quantity : 0;
  }
  return result;
};

/**
 * コースメニューを商品として追加するためのページ
 * @returns
 */
export const CourseMenuAsMenuItemDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const facilityId = useFacilityId();
  const { id: courseId } = router.query;
  if (typeof courseId !== 'string') {
    throw new Error('invalid query');
  }

  const initialQuantitiesByEntryId = getInitialQuantitiesFromQuery(router.query);

  const [{ data, error, fetching }] = useGetCourseMenuForMenuItemDetailQuery({
    variables: {
      facilityId,
      courseId,
      orderType,
    },
  });

  if (error) {
    throw error;
  }
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (!data || !data.facility || !isFacility(data.facility)) {
    throw new Error('データが見つかりませんでした。');
  }

  const { tenant, courseMenu, viewer } = data;
  if (!courseMenu || !isCourseMenu(courseMenu)) {
    throw new Error('invalid course menu');
  }

  // 実のところ、この画面ではmasterとしての使われ方はしないので、CourseMenuEntryMasterItemとしてnameなどをstateに保持する必要はないのだが
  // CourseMenuEntriesFormProvider のロジックを再利用する都合上、このような形にしている
  const entriesForProvider = courseMenu.entries.map<CourseMenuEntryMasterItem>((entry) => {
    return {
      ...entry,
      courseMenuId: courseMenu.id,
      courseMenuName: courseMenu.name,
      courseMenuMinSelectCount: courseMenu.minSelectCount,
      initialQuantity: initialQuantitiesByEntryId?.[entry.id] ?? 0,
    };
  });

  return (
    <FeatureFlagsProvider featureFlags={data.facility.featureFlags}>
      <NavigationHeaderLayout viewing={tenant} viewer={viewer} facility={data.facility} orderType={orderType}>
        <Flex direction="column" align="stretch" h="full" pt="40px" gap="40px">
          <CourseMenuInfo courseMenu={courseMenu} />

          <CourseMenuEntriesFormProvider courseMenuEntries={entriesForProvider}>
            <Box
              mx={containerMarginX}
              mb="120px" // 画面下部にカート追加ボタンが固定されるので、大きめに余白をとる
            >
              <CourseMenuEntriesInput courseMenu={courseMenu} />
            </Box>
            <CourseMenuEntriesSubmit
              cartId={viewer.cart.id}
              courseMenuId={courseId}
              isUpdate={initialQuantitiesByEntryId !== null}
            />
          </CourseMenuEntriesFormProvider>
        </Flex>
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

const CourseMenuEntriesSubmit = ({
  cartId,
  courseMenuId,
  isUpdate,
}: {
  cartId: string;
  courseMenuId: string;
  isUpdate: boolean;
}) => {
  const state = useCourseMenuEntriesForm();
  const { validate } = useCourseMenuEntriesFormDispatch();
  const selectedEntries = selectSelectedEntriesAsCartItem(state);

  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const home = useHomePath(orderType);

  const [{ fetching: adding }, addCourseMenu] = useAddCourseMenuMutation();
  const [{ fetching: updating }, updateCourseMenu] = useUpdateCourseMenuMutation();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { showPriceExcludingTax } = useFeatureFlags();

  const totalQuantity = selectedEntries.reduce((acc, entry) => acc + entry.quantity, 0);
  const subtotalPrice = selectedEntries.reduce((acc, entry) => acc + entry.price * entry.quantity, 0);
  // TODO: コースメニューはイートイン提供のみという前提で、すべて標準税率扱いにしている。もし前提が変わる場合は修正が必要
  const subtotalPriceExcludingTax = getPriceExcludingTax(TaxRateType.Normal, subtotalPrice, taxRoundTypes.RoundFloor);

  // minSelectCountによるvalidateに加えて、この画面では最低1つ以上選択されていることを必須とする。
  // 何も選択せずにこの画面でカートに追加する必要はないため。
  const buttonDisabled = totalQuantity === 0;

  const handleAddCourseMenu = async () => {
    const { error } = await addCourseMenu({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        courseMenuId,
        entries: selectedEntries.map((entry) => ({
          id: entry.courseMenuEntryId,
          quantity: entry.quantity,
        })),
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
  };

  const handleUpdateCourseMenu = async () => {
    const { error } = await updateCourseMenu({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        courseMenuId,
        entries: selectedEntries.map((entry) => ({
          id: entry.courseMenuEntryId,
          quantity: entry.quantity,
        })),
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    if (isUpdate) {
      await handleUpdateCourseMenu();
      await router.push(cartPage(facilityId, orderType));
    } else {
      await handleAddCourseMenu();
      await router.push(home);
    }
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      py="16px"
      w="full"
      maxW={variables.containerMaxWidth}
      px={containerMarginX}
      bgColor="mono.white"
      borderTop="1px"
      borderTopColor="mono.divider"
      zIndex="sticky"
    >
      <PrimaryButton onClick={handleSubmit} disabled={buttonDisabled} isLoading={adding || updating} h="56px">
        <HStack w="full" justify="space-between" align="stretch" alignItems="center">
          <Text>{isUpdate ? 'カートの内容を更新する' : 'カートに追加する'}</Text>
          <VStack align="end" spacing={0}>
            <Text className="bold-normal">
              {formatPrice(showPriceExcludingTax ? subtotalPriceExcludingTax : subtotalPrice)}
            </Text>
            {showPriceExcludingTax && <Text className="text-micro">{`(税込${formatPrice(subtotalPrice)})`}</Text>}
          </VStack>
        </HStack>
      </PrimaryButton>
    </Box>
  );
};
