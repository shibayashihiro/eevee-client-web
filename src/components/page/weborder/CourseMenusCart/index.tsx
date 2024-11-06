import { Box, Center, Checkbox, HStack, ListItem, Text, UnorderedList, useDisclosure, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { TableNumberMainHeader } from '@/components/domain/TableNumberMainHeader';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderType } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { CartSubHeader } from '@/components/domain/Cart/CartSubHeader';
import { CartOrderItemList } from '@/components/domain/Cart/CartOrderItemList';
import {
  CourseMenuRule,
  CourseMenusCartItem,
  selectCartItems,
  selectCartItemsTotalPrice,
  selectPaidCartItems,
  useCourseMenusCart,
  useCourseMenusCartDispatch,
} from '@/providers/CourseMenusCartProvider';
import { CartOrderItem } from '@/components/domain/Cart/CartOrderItem';
import { CartOrderItemActions } from '@/components/domain/Cart/CartOrderItemActions';
import { courseMenuPage } from '@/utils/paths/facilityPages';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { formatPrice } from '@/utils/formatUtils';
import { OrderPrivacyPolicyAgreement } from '@/components/domain/OrderPrivacyPolicyAgreement';
import { PrimaryButton } from '@/components/ui/Button';
import variables from '@/styles/variables.module.scss';
import { isFacility, isTable } from '@/graphql/helper';
import { CartFacilityName } from '@/components/domain/CartFacilityName';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';
import { useSubmitCourseMenus } from '@/providers/CourseMenusCartProvider/useSubmitCourseMenus';
import { FeatureFlagsProvider, useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { GetCourseMenusCartPageQuery, useGetCourseMenusCartPageQuery } from './CourseMenusCart.query.generated';
import { useGuardEmptyCart } from './useGuardEmptyCart';

export const CourseMenusCartPage: NextPageWithLayout = () => {
  const tableId = useTableIdFromQuery();
  const facilityId = useFacilityId();
  const [{ data, fetching, error }] = useGetCourseMenusCartPageQuery({
    variables: {
      tableId,
      facilityId,
    },
  });
  // 現状、コースメニューはイートインのみのため固定
  const orderType = OrderType.EatIn;

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data || !data.facility || !isFacility(data.facility)) {
    throw new Error('not found');
  }

  const table = data.table;
  return (
    <>
      <FeatureFlagsProvider featureFlags={data.facility.featureFlags}>
        <NavigationHeaderLayout
          orderType={orderType}
          viewing={data?.viewing}
          viewer={data.viewer}
          facility={data.facility}
          disableHomeLink
        >
          {table && isTable(table) && <TableNumberMainHeader table={table} />}
          <Box as="main" pt="32px" px="20px" pb="20px" mb="120px">
            <CartContent data={data} />
            <Box mt="">
              <ChargeDetails />
            </Box>
            <Box mt="24px">
              <OrderPrivacyPolicyAgreement />
            </Box>
          </Box>
          <SubmitCartButtonFixedFooter />
        </NavigationHeaderLayout>
      </FeatureFlagsProvider>
    </>
  );
};

function CartContent({ data }: { data: GetCourseMenusCartPageQuery }) {
  const state = useCourseMenusCart();
  const dispatch = useCourseMenusCartDispatch();
  const cartItems = selectPaidCartItems(state);

  const [deleteItem, setDeleteItem] = useState<CourseMenusCartItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { facility } = data;

  const handleOpenDeleteDialog = (item: CourseMenusCartItem) => {
    setDeleteItem(item);
    onOpen();
  };

  const submitDeleteItem = () => {
    if (deleteItem) {
      dispatch({
        type: 'REMOVE_ITEM',
        courseMenuId: deleteItem.courseMenuId,
        courseMenuEntryId: deleteItem.courseMenuEntryId,
      });
      onClose();
    }
  };

  return (
    <>
      <Box>
        <VStack align="stretch" spacing="8px" mb="32px">
          {facility && isFacility(facility) && <CartFacilityName facility={facility} />}
          <Text className="text-normal">
            選択した内容を確認の上「この内容で注文する」ボタンを押すとメニューが表示されます
          </Text>
        </VStack>
        <CartSubHeader>ご注文内容</CartSubHeader>
        <CartOrderItemList>
          {cartItems.map((item) => (
            <CartItem key={item.courseMenuEntryId} item={item} onClickDelete={handleOpenDeleteDialog} />
          ))}
        </CartOrderItemList>
      </Box>
      <ModalDialog
        title="カートから削除"
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{ text: 'キャンセル', onClick: onClose }}
        primaryAction={{ text: 'OK', onClick: submitDeleteItem }}
        closeOnOverlayClick={false}
      >
        <Text>
          {deleteItem?.courseMenuName}({deleteItem?.courseMenuEntryName}) をカートから削除してもよろしいですか？
        </Text>
      </ModalDialog>
    </>
  );
}

const CartItem = ({
  item,
  onClickDelete,
}: {
  item: CourseMenusCartItem;

  onClickDelete: (item: CourseMenusCartItem) => void;
}) => {
  const facilityId = useFacilityId();
  const tableId = useTableIdFromQuery();
  const router = useTenantRouter();

  const handleOnClickEdit = () => {
    router.push(courseMenuPage(facilityId, tableId, item.courseMenuId));
  };

  const handleOnClickDelete = () => {
    onClickDelete(item);
  };
  return (
    <CartOrderItem
      itemName={item.courseMenuName}
      quantity={item.quantity}
      price={item.price * item.quantity}
      orderType={OrderType.EatIn} // コースメニューはEatInのみ対応。他のOrderTypeは未対応
      options={<Text className="text-extra-small">{item.courseMenuEntryName}</Text>}
      actions={<CartOrderItemActions onClickEdit={handleOnClickEdit} onClickDelete={handleOnClickDelete} />}
    />
  );
};

const ChargeDetails = () => {
  const state = useCourseMenusCart();
  const { showPriceExcludingTax } = useFeatureFlags();
  // 現状は常に小計=合計
  const totalPrice = selectCartItemsTotalPrice(state);
  // 税抜き表示をおこなう場合、細かな端数ずれが起きるため、ここでは金額を表示しない
  if (showPriceExcludingTax) {
    return null;
  }
  return (
    <VStack align="stretch" py="16px" spacing="8px">
      <HStack as="p" className="text-extra-small" justifyContent="space-between" spacing="8px">
        <Text as="span">小計</Text>
        <Text as="span">{formatPrice(totalPrice)}</Text>
      </HStack>
      <HStack as="p" className="bold-normal" justifyContent="space-between" spacing="8px">
        <Text as="span">合計</Text>
        <Text as="span">{formatPrice(totalPrice)}</Text>
      </HStack>
    </VStack>
  );
};

const SubmitCartButtonFixedFooter = () => {
  const tableId = useTableIdFromQuery();
  const state = useCourseMenusCart();
  const facilityId = useFacilityId();
  const { setDisabled } = useGuardEmptyCart(facilityId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { loading, submitCourseMenus } = useSubmitCourseMenus({ facilityId, tableId });

  const submit = async () => {
    // 注文後はカートが空になるため、ガードを解除する
    setDisabled(true);
    try {
      return submitCourseMenus(selectCartItems(state));
    } catch (e) {
      setDisabled(false);
      throw e;
    }
  };

  const handleOnClick = async () => {
    if (state.rule && state.rule.descriptions.length > 0) {
      onOpen();
    } else {
      await submit();
    }
  };

  return (
    <>
      <Center
        w="full"
        bg="white"
        maxW={variables.containerMaxWidth}
        position="fixed"
        bottom="0"
        left="auto"
        h="100px"
        py="22px"
        px="20px"
        borderTop="0.5px solid"
        borderColor="mono.divider"
      >
        <PrimaryButton h="56px" onClick={handleOnClick} isLoading={loading}>
          この内容で注文する
        </PrimaryButton>
      </Center>
      {state.rule && <ConfirmRulesDialog rule={state.rule} isOpen={isOpen} onClose={onClose} onClickSubmit={submit} />}
    </>
  );
};

const ConfirmRulesDialog = ({
  rule,
  isOpen,
  onClose,
  onClickSubmit,
}: {
  rule: CourseMenuRule;
  isOpen: boolean;
  onClose: () => void;
  onClickSubmit: () => void;
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleOnClick = () => {
    onClickSubmit();
    onClose();
  };

  return (
    <ModalDialog
      title={`${rule.title}のルールについて`}
      isOpen={isOpen}
      onClose={onClose}
      primaryAction={{
        text: `${rule.title}をはじめる`,
        onClick: handleOnClick,
        disabled: !confirmed,
      }}
      closeOnOverlayClick={false}
    >
      <UnorderedList>
        {rule.descriptions.map((description, index) => (
          <ListItem key={index} className="text-small">
            {description}
          </ListItem>
        ))}
      </UnorderedList>
      <Checkbox
        size="lg"
        mt="24px"
        colorScheme="brand"
        onChange={(e) => setConfirmed(e.target.checked)}
        isChecked={confirmed}
      >
        <Text as="span" className="bold-small">
          ルールを確認しました
        </Text>
      </Checkbox>
    </ModalDialog>
  );
};
