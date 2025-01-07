import { Text } from '@chakra-ui/react';

import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { privacyPage } from '@/utils/paths/tenantPages';

import { TenantPageLink } from '../TenantPageLink';

import { useOrderPrivacyPolicyAgreementPageQuery } from './OrderPrivacyPolicyAgreement.query.generated';

export const OrderPrivacyPolicyAgreement = () => {
  const [result] = useOrderPrivacyPolicyAgreementPageQuery();
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (fetching) {
    return null;
  }
  if (!data) {
    throw new Error('not found');
  }

  return (
    <Text className="text-extra-small" mb="24px">
      当サイトの
      {data.viewing.privacyPolicyUrl ? (
        <WrappedLink
          color="brand.primaryText"
          href={data.viewing.privacyPolicyUrl}
          isExternal={true}
          textDecoration="underline"
        >
          プライバシーポリシー
        </WrappedLink>
      ) : (
        <TenantPageLink color="brand.primaryText" href={privacyPage} target="_blank" textDecoration="underline">
          プライバシーポリシー
        </TenantPageLink>
      )}
      に同意の上「この内容で注文する」ボタンを押してください。
    </Text>
  );
};
