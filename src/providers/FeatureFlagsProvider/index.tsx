/**
 * Feature Flags をComponentから取得しやすくするためのProvider
 */
import { createContext, useContext, useMemo } from 'react';

import { FeatureFlagsForProviderFragment } from './FeatureFlagsProvider.fragment.generated';

export type FeatureFlags = {
  // 価格の税抜き表示をするかどうか
  showPriceExcludingTax: boolean;
  // スタンプカード・会員証機能等を利用するかどうか
  loyaltyProgramEnabled: boolean;
  // アイテムコード検索をするかどうか
  itemCodeSearchEnabled: boolean;
};

export const FeatureFlagsContext = createContext<FeatureFlags | null>(null);

export const useFeatureFlags = (): FeatureFlags => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
  featureFlags: FeatureFlagsForProviderFragment;
};

export const FeatureFlagsProvider = ({ featureFlags, children }: Props) => {
  const value = useMemo(() => ({ ...featureFlags }), [featureFlags]);
  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};
