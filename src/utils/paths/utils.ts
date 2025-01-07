import { OrderType } from '@/graphql/generated/types';

export const orderTypePathNames: Record<OrderType, string> = {
  [OrderType.Delivery]: 'delivery',
  [OrderType.EatIn]: 'eatin',
  [OrderType.Takeout]: 'takeout',
} as const;

export type OrderTypePathName = (typeof orderTypePathNames)[OrderType];

const orderTypesByPathName: Record<OrderTypePathName, OrderType> = {
  delivery: OrderType.Delivery,
  eatin: OrderType.EatIn,
  takeout: OrderType.Takeout,
} as const;

export const isOrderTypePathName = (value: string): value is OrderTypePathName => {
  return value in orderTypesByPathName;
};
