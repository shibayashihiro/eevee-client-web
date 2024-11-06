import { PrivacyPolicyContentSpecial, hasSpecialPrivacyPolicy } from './PrivacyPolicyContentSpecial';
import { PrivacyPolicyContentV1 } from './PrivacyPolicyContent/PrivacyPolicyContentV1';
import { PrivacyPolicyContentLatest } from './PrivacyPolicyContent/PrivacyPolicyContentLatest';

type Props = {
  tenantUid: string;
  specifiedCommercialTransactionActUrl: string;
  appInfoForLINE?: AppInfoForLINE;
};

export type AppInfoForLINE = {
  lineAppName: string;
  companyName: string;
  companyAddress: string;
};

/**
 * MEMO: モバイルアプリ向けのプラポリの時は、LINEの情報は取れないので、旧プラポリを表示する。
 * それ以外の場合は、LINEについて書かれたプラポリを表示する。
 * また、一部のTenantは専用のプラポリを持っており、その場合はそちらを表示する
 */
export const PrivacyPolicy = ({ tenantUid, specifiedCommercialTransactionActUrl, appInfoForLINE }: Props) => {
  if (hasSpecialPrivacyPolicy(tenantUid)) {
    return <PrivacyPolicyContentSpecial tenantUid={tenantUid} />;
  }

  if (!appInfoForLINE) {
    return <PrivacyPolicyContentV1 specifiedCommercialTransactionActUrl={specifiedCommercialTransactionActUrl} />;
  }

  const { lineAppName, companyName, companyAddress } = appInfoForLINE;
  return (
    <PrivacyPolicyContentLatest
      specifiedCommercialTransactionActUrl={specifiedCommercialTransactionActUrl}
      lineAppName={lineAppName}
      companyName={companyName}
      companyAddress={companyAddress}
    />
  );
};
