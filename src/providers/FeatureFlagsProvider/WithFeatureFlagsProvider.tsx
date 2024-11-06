import { GraphQLResult, isFacility } from '@/graphql/helper';

import { FeatureFlagsProvider } from '.';

type Props = {
  facility?: GraphQLResult | null;
  children: React.ReactNode;
};

// FeatureFlagsを所有しているFacilityは、現状Nodeとして取得する必要があり
// そのままだとType Checkが必要で面倒なため、その辺りを再利用可能にするためのヘルパーComponent
export const WithFeatureFlagsProvider = ({ facility, children }: Props) => {
  if (!facility || !isFacility(facility)) {
    return <>{children}</>;
  }
  return <FeatureFlagsProvider featureFlags={facility.featureFlags}>{children}</FeatureFlagsProvider>;
};
