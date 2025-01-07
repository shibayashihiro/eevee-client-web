import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import { ChargeDetailsFullListPartsFragmentDoc } from '../../../domain/ChargeDetailsFullList/ChargeDetailsFullList.fragment.generated';
import { PaymentDialogPartsFragmentDoc } from '../../../domain/PaymentDialog/PaymentDialog.fragment.generated';
import { PaymentItemPartsFragmentDoc } from '../../../domain/PaymentItem/PaymentItem.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TableOrdersPaymentPageQueryQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
}>;

export type TableOrdersPaymentPageQueryQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    table?: {
      __typename: 'Table';
      name: string;
      charge?: {
        __typename: 'Charge';
        amount: number;
        details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
      } | null;
      order?: {
        __typename: 'OrderInfo';
        orderId?: string | null;
        selectedCouponId?: string | null;
        customerCount?: number | null;
      } | null;
    } | null;
    payments: Array<{
      __typename: 'Payment';
      id: string;
      paymentType: Types.PaymentType;
      name: string;
      brand: string;
      isSelected: boolean;
      isSignInRequired: boolean;
    }>;
    coupons: {
      __typename: 'CouponConnection';
      nodes: Array<{
        __typename: 'Coupon';
        id: string;
        title: string;
        subTitle: string;
        statusLabel: string;
        image: string;
        canManualUse: boolean;
        details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
      }>;
      pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
    };
  };
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
        featureFlags: {
          __typename: 'FeatureFlags';
          showPriceExcludingTax: boolean;
          loyaltyProgramEnabled: boolean;
          itemCodeSearchEnabled: boolean;
          OnlinePaymentEnabled: boolean;
        };
      }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
};

export const TableOrdersPaymentPageQueryDocument = gql`
  query TableOrdersPaymentPageQuery($facilityID: ID!) {
    viewer {
      table(facilityID: $facilityID) {
        name
        charge {
          ...ChargeDetailsFullListParts
        }
        order {
          orderId
          selectedCouponId
          customerCount
        }
      }
      payments {
        ...PaymentDialogParts
      }
      coupons {
        nodes {
          id
          title
          subTitle
          statusLabel
          image
          details {
            name
            value
          }
          canManualUse
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    facility: node(id: $facilityID) {
      ... on Facility {
        featureFlags {
          showPriceExcludingTax
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${ChargeDetailsFullListPartsFragmentDoc}
  ${PaymentDialogPartsFragmentDoc}
  ${PaymentItemPartsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useTableOrdersPaymentPageQueryQuery(
  options: Omit<Urql.UseQueryArgs<TableOrdersPaymentPageQueryQueryVariables>, 'query'>,
) {
  return Urql.useQuery<TableOrdersPaymentPageQueryQuery, TableOrdersPaymentPageQueryQueryVariables>({
    query: TableOrdersPaymentPageQueryDocument,
    ...options,
  });
}
