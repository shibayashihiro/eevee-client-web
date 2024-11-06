import { FC } from 'react';

import { PrivacyPolicyContentQBT } from './PrivacyPolicyContentQBT';
import { PrivacyPolicyContentTokyu } from './PrivacyPolicyContentTokyu';

type Props = {
  tenantUid: string;
};

const componentByTenantUid = {
  '7ZC3l69dpyVAnEbrZ4Ez': PrivacyPolicyContentTokyu,
  xi20nuWTXnBv88535QpG: PrivacyPolicyContentQBT,
} as const;

type SpecialTenantUId = keyof typeof componentByTenantUid;
const specialTenantUIds: string[] = Object.keys(componentByTenantUid);

export const hasSpecialPrivacyPolicy = (tenantUid: string): tenantUid is SpecialTenantUId => {
  return specialTenantUIds.includes(tenantUid);
};

export const PrivacyPolicyContentSpecial: FC<Props> = ({ tenantUid }) => {
  if (!hasSpecialPrivacyPolicy(tenantUid)) {
    console.error(`Unknown tenantUid: ${tenantUid}`);
    return null;
  }
  const Component = componentByTenantUid[tenantUid];
  return <Component />;
};
