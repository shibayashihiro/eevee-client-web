import { Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { courseMenuAsMenuItemDetailPage } from '@/utils/paths/facilityPages';
import { OrderType } from '@/graphql/generated/types';

import { CartOrderItem } from '../Cart/CartOrderItem';
import { CartOrderItemActions } from '../Cart/CartOrderItemActions';

import { CartCourseMenuItemFragment } from './CartCourseMenuItem.fragment.generated';

type Props = {
  courseMenuItem: CartCourseMenuItemFragment;
  onClickDelete: () => void;

  // 「内容を変更する」からの遷移先に、「今同じCourseMenu内で選択されているすべてのEntry」を渡す必要があるため、
  // その情報を生成するために、Cart内のItemすべてを渡す。
  // 良い感じのBackend APIができたら、これは不要
  allCartItems: CartCourseMenuItemFragment[];
};

export const CartCourseMenuItem = ({ courseMenuItem: item, onClickDelete, allCartItems }: Props) => {
  const facilityId = useFacilityId();
  const router = useTenantRouter();

  // 編集画面に渡すための情報を作る
  const quantityByEntryIdInSameCourseMenu = useMemo(() => {
    const itemsInCourseMenu = allCartItems.filter((i) => i.courseMenu.id === item.courseMenu.id);
    return itemsInCourseMenu.reduce<{ [entryId: string]: number }>((acc, i) => {
      const entryId = i.entry.id;
      if (acc[entryId] === undefined) {
        acc[entryId] = 0;
      }
      acc[entryId] += i.quantity;
      return acc;
    }, {});
  }, [allCartItems, item.courseMenu.id]);

  const handleOnClickEdit = () => {
    router.push(courseMenuAsMenuItemDetailPage(facilityId, item.courseMenu.id, quantityByEntryIdInSameCourseMenu));
  };

  return (
    <CartOrderItem
      itemName={item.courseMenu?.category?.name ?? ''} // NOTE categoryがnullなことは無い想定
      options={<Text className="text-extra-small">{item.courseMenu.name}</Text>}
      quantity={item.quantity}
      orderType={OrderType.EatIn} // コースメニューはEatInのみ対応。他のOrderTypeは未対応
      price={item.totalPrice}
      actions={<CartOrderItemActions onClickEdit={handleOnClickEdit} onClickDelete={onClickDelete} />}
    />
  );
};
