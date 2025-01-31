import { FC } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderType, TaxRateType } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { generateMutationId, isCourseMenu, isFacility } from '@/graphql/helper';
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
import { tableOrderCartPage } from '@/utils/paths/facilityPages';
import { FeatureFlagsProvider, useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { getPriceExcludingTax, taxRoundTypes } from '@/utils/domain/tax';

import { useGetCourseMenuForMenuItemDetailQuery } from './CourseMenuDetailModalContent.query.generated';
import { CourseMenuInfo } from './CourseMenuInfo';
import { CourseMenuEntriesInput } from './CourseMenuEntriesInput';
import {
  useAddCourseMenuMutation,
  useUpdateCourseMenuMutation,
} from './CourseMenuDetailModalContent.mutation.generated';

// コースメニューは現状、EatInのみ対応
const orderType = OrderType.EatIn;

// queryパラメータを参照して、entryId: quantity の形式を返す
const getInitialQuantities = (quantities: { [entryId: string]: number }): { [entryId: string]: number } | null => {
  if (!quantities || Object.keys(quantities).length === 0) {
    return null;
  }

  const result: { [entryId: string]: number } = {};

  for (const entryId in quantities) {
    if (quantities.hasOwnProperty(entryId)) {
      const quantity = quantities[entryId];
      result[entryId] = !isNaN(quantity) ? quantity : 0;
    }
  }

  return result;
};

/**
 * コースメニューを商品として追加するためのページ
 * @returns
 */
type Props = {
  courseMenuId: string;
  quantities?: { [entryId: string]: number };
  closeModal?: () => void;
};

export const CourseMenuDetailModalContent: FC<Props> = ({ courseMenuId, quantities = {}, closeModal }: Props) => {
  const facilityId = useFacilityId();
  if (typeof courseMenuId !== 'string') {
    throw new Error('invalid query');
  }

  const initialQuantitiesByEntryId = getInitialQuantities(quantities);

  const [{ data, error, fetching }] = useGetCourseMenuForMenuItemDetailQuery({
    variables: {
      facilityId,
      courseId: courseMenuId,
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

  const { courseMenu, viewer } = data;
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
      <CourseMenuEntriesFormProvider courseMenuEntries={entriesForProvider}>
        <CourseMenuInfo courseMenu={courseMenu} />
        <CourseMenuEntriesInput courseMenu={courseMenu} />
        <Box mb="112px">
          <CourseMenuEntriesSubmit
            cartId={viewer.cart.id}
            courseMenuId={courseMenuId}
            isUpdate={initialQuantitiesByEntryId !== null}
            closeModal={closeModal}
          />
        </Box>
      </CourseMenuEntriesFormProvider>
    </FeatureFlagsProvider>
  );
};

const CourseMenuEntriesSubmit = ({
  cartId,
  courseMenuId,
  isUpdate,
  closeModal,
}: {
  cartId: string;
  courseMenuId: string;
  isUpdate: boolean;
  closeModal?: () => void;
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
      await router.push(tableOrderCartPage(facilityId));
    } else {
      await handleAddCourseMenu();
      await router.push(home);
    }
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      pt="24px"
      pb="64px"
      w="full"
      maxW={variables.containerMaxWidth}
      px={containerMarginX}
      bgColor="mono.white"
      borderTop="1px"
      borderTopColor="mono.divider"
      zIndex="sticky"
    >
      <PrimaryButton onClick={handleSubmit} disabled={buttonDisabled} isLoading={adding || updating} h="56px">
        <VStack alignItems="center" px="24px" w="full" spacing="0">
          <Text className="bold-small">{isUpdate ? 'カートの内容を更新する' : 'カートに追加する'}</Text>
          <HStack spacing="4px" alignItems="center">
            <Text className="bold-small">
              {formatPrice(showPriceExcludingTax ? subtotalPriceExcludingTax : subtotalPrice)}
            </Text>
            {showPriceExcludingTax && <Text className="text-micro">{`(税込${formatPrice(subtotalPrice)})`}</Text>}
          </HStack>
        </VStack>
      </PrimaryButton>
    </Box>
  );
};
