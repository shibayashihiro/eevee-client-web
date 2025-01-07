import { useContext, useMemo } from 'react';
import { createContext } from 'react';

import { deliveryHome, eatInHome, takeoutHome } from '@/utils/paths/facilityPages';
import { OrderType } from '@/graphql/generated/types';
import { home } from '@/utils/paths/tenantPages';
import { apps, UICustomization } from '@/apps';

type State = {
  tenantIdentifier: string;
  tenantUid: string;
  usingOriginalIdProvider: boolean;
  facilityId?: string;
  orderType?: OrderType;
  uiCustomization?: UICustomization;
};

const AppStateContext = createContext<State | null>(null);

const useState = (): State | null => {
  return useContext(AppStateContext);
};

export const useTenantIdentifier = (): string => {
  const state = useState();
  return state?.tenantIdentifier ?? '';
};

export const useTenantUid = (): string => {
  const state = useState();
  return state?.tenantUid ?? '';
};

export const useFacilityId = (): string => {
  const state = useState();
  if (!state?.facilityId) {
    throw new Error('facilityId is not defined');
  }
  return state?.facilityId ?? '';
};

export const useFacilityIdOrNull = (): string | null => {
  const state = useState();
  return state?.facilityId ?? null;
};

export const useUICustomization = (): UICustomization | null => {
  const state = useState();
  return state?.uiCustomization ?? null;
};

export const useUsingOriginalIdProvider = (): boolean => {
  const state = useState();
  return state?.usingOriginalIdProvider ?? false;
};

export const usePromotionEnabled = (): boolean => {
  const tenantIdentifier = useTenantIdentifier();
  const cfg = apps.getConfig(tenantIdentifier);
  return cfg?.promotionEnabled ?? false;
};

/**
 * FacilityID、OrderTypeが解決できる場合に、Home画面を返す(tenantIdentifierは除くpath)
 * 上記が解決できない場合は、tenantIdentifier直下を返すため注意。
 * （エラー時のfallbackなどどうしてもグローバルにHomeを解決したいケース以外で使わない）
 * @returns
 */
export const useResolvedHomePath = (): string => {
  const state = useState();
  if (!state || !state.facilityId || !state.orderType) {
    return home;
  }
  const { facilityId, orderType } = state;
  switch (orderType) {
    case OrderType.EatIn:
      return eatInHome(facilityId);
    case OrderType.Delivery:
      return deliveryHome(facilityId);
    case OrderType.Takeout:
      return takeoutHome(facilityId);
  }
};

// 初期stateを外から渡す
type Props = State & {
  children: React.ReactNode;
};

export const WebOrderPageStateProvider = ({ children, ...state }: Props) => {
  const contextValue = useMemo(() => ({ ...state }), [state]);
  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};
