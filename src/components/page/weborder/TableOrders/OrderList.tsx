import { VStack, Text, List, ListItem, Divider } from '@chakra-ui/react';
import { Fragment } from 'react';

import { DateTime, OrderType } from '@/graphql/generated/types';
import { formatDateToHMM } from '@/utils/formatUtils';
import { dateTimeToDate } from '@/graphql/helper';
import { CartMenuItem } from '@/components/domain/CartMenuItem';
import { CartMenuItemFragment } from '@/components/domain/CartMenuItem/CartMenuItem.fragment.generated';
import { CartCourseMenuItemFragment } from '@/components/domain/CartCourseMenuItem/CartCourseMenuItem.fragment.generated';
import { CartOrderItem } from '@/components/domain/Cart/CartOrderItem';

import {
  TableOrdersPageOrderListItemPartsFragment,
  TableOrdersPageOrderListPartsFragment,
} from './OrderList.fragment.generated';

type Props = {
  orderList: TableOrdersPageOrderListPartsFragment;
};

export const OrderList = ({ orderList }: Props) => {
  return (
    <>
      <List w="full" spacing="32px">
        {orderList.orders.map((order) => (
          <ListItem key={order.id}>
            <OrderListItem order={order} />
          </ListItem>
        ))}
        <ListItem key="couremenu"></ListItem>
        <CourseMenuList orderList={orderList} />
        <List />
        <Divider />
      </List>
    </>
  );
};

const OrderListItem = ({ order }: { order: TableOrdersPageOrderListItemPartsFragment }) => {
  return (
    <>
      {order.submittedAt && (
        <OrderStatusDescription submittedAt={order.submittedAt} prepared={order.progress?.prepared == true} />
      )}
      <OrderItems items={order.items} />
    </>
  );
};

const CourseMenuList = ({ orderList }: { orderList: TableOrdersPageOrderListPartsFragment }) => {
  return (
    <List w="full">
      <ListItem>
        {orderList.mainCourseMenu != null && <CourseMenus courseMenuItems={orderList.mainCourseMenu.courseMenuItems} />}
      </ListItem>
      {orderList.subCourseMenus.map((courseMenu) => (
        <ListItem key="courseMenuList">
          <CourseMenus key={courseMenu.courseMenu.id} courseMenuItems={courseMenu.courseMenuItems} />
        </ListItem>
      ))}
    </List>
  );
};

const CourseMenus = ({ courseMenuItems }: { courseMenuItems: CartCourseMenuItemFragment[] }) => {
  return (
    <VStack align="stretch">
      {courseMenuItems.map((item) => {
        return (
          <>
            <Divider />
            <CartOrderItem
              itemName={item.courseMenu.name}
              quantity={item.quantity}
              price={item.totalPrice}
              orderType={OrderType.EatIn} // コースメニューはEatInのみ対応。他のOrderTypeは未対応
              options={<Text className="text-extra-small">{item.entry.name}</Text>}
            />
          </>
        );
      })}
    </VStack>
  );
};

const OrderStatusDescription = ({ submittedAt, prepared }: { submittedAt: DateTime; prepared: boolean }) => {
  const description = prepared ? '調理が完了しています。' : '準備ができ次第、スタッフがお届けします。';
  return (
    <VStack align="start" spacing="0px">
      <Text fontSize="md" fontWeight="semibold">
        {formatDateToHMM(dateTimeToDate(submittedAt))}
      </Text>
      <Text>{description}</Text>
    </VStack>
  );
};

const OrderItems = (items: { items: CartMenuItemFragment[] }) => {
  return (
    <List w="full">
      <Divider />
      {items.items.map((item) => (
        <Fragment key={item.id}>
          <ListItem>
            <CartMenuItem item={item} orderType={OrderType.EatIn} readonly />
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};
