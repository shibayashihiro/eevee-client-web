import { useMemo } from 'react';
import { OperationContext } from 'urql';

import * as Types from './generated/types';
import { DateTime, OrderType } from './generated/types';

export type GraphQLResult = { __typename: string };

export const isObjectType = <T extends GraphQLResult>(obj: GraphQLResult, typename: T['__typename']): obj is T => {
  return obj.__typename === typename;
};

const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateMutationId = () => generateRandomString(16);

/**
 * Query結果で 空の Array が返ってきた場合、typename を自動判定できないため
 * その時 or その後Cacheを更新できない場合がある（Document Cacheの仕様）
 * これを回避したい場合は additionalTypenames を指定した context を useQuery の context に渡す。
 * (必ずしもこの関数で生成する必要はないが、Genericsを用いてより程度型安全に生成するための関数)
 * ref: https://formidable.com/open-source/urql/docs/basics/document-caching/#adding-typenames
 *
 * それ以外でも「このMutaitonが行われたらキャッシュを更新したい」ときにはこれを使える。
 */
export const useAdditionalTypeNamesContext = <T extends GraphQLResult[]>(
  typenames: T[number]['__typename'][],
): Pick<OperationContext, 'additionalTypenames'> => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ additionalTypenames: typenames }), []);
};

export const isTenant = (obj: GraphQLResult): obj is Types.Tenant => isObjectType<Types.Tenant>(obj, 'Tenant');
export const isFacility = (obj: GraphQLResult): obj is Types.Facility => isObjectType<Types.Facility>(obj, 'Facility');
export const isMenuItem = (obj: GraphQLResult): obj is Types.MenuItem => isObjectType<Types.MenuItem>(obj, 'MenuItem');
export const isMenuCategory = (obj: GraphQLResult): obj is Types.MenuCategory =>
  isObjectType<Types.MenuCategory>(obj, 'MenuCategory');
export const isCart = (obj: GraphQLResult): obj is Types.Cart => isObjectType<Types.Cart>(obj, 'Cart');
export const isEatInOrder = (obj: GraphQLResult): obj is Types.EatInOrder =>
  isObjectType<Types.EatInOrder>(obj, 'EatInOrder');
export const isDeliveryOrder = (obj: GraphQLResult): obj is Types.DeliveryOrder =>
  isObjectType<Types.DeliveryOrder>(obj, 'DeliveryOrder');
export const isTakeoutOrder = (obj: GraphQLResult): obj is Types.TakeoutOrder =>
  isObjectType<Types.TakeoutOrder>(obj, 'TakeoutOrder');
export const isUser = (obj: GraphQLResult): obj is Types.User => isObjectType<Types.User>(obj, 'User');

export const isTable = (obj: GraphQLResult): obj is Types.Table => isObjectType<Types.Table>(obj, 'Table');

export const isCourseMenu = (obj: GraphQLResult): obj is Types.CourseMenu =>
  isObjectType<Types.CourseMenu>(obj, 'CourseMenu');

export const isSurveyForm = (obj: GraphQLResult): obj is Types.SurveyForm =>
  isObjectType<Types.SurveyForm>(obj, 'SurveyForm');
export const isSurveyConfig = (obj: GraphQLResult): obj is Types.SurveyConfig =>
  isObjectType<Types.SurveyConfig>(obj, 'SurveyConfig');

export const isSurvey = (obj: GraphQLResult): obj is Types.Survey => isObjectType<Types.Survey>(obj, 'Survey');

export const getOrderType = (obj: GraphQLResult): OrderType => {
  if (isEatInOrder(obj)) {
    return OrderType.EatIn;
  } else if (isDeliveryOrder(obj)) {
    return OrderType.Delivery;
  }
  return OrderType.Takeout;
};

// DateTime型はRFC3339形式の文字列(例: 2023-09-04T11:35:45Z)であるため、そのままDateコンストラクタに渡せば良い
export const dateTimeToDate = (datetime: DateTime): Date => new Date(datetime);
