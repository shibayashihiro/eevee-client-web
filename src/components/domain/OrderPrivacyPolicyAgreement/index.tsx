import { Text } from '@chakra-ui/react';

import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { privacyPage } from '@/utils/paths/tenantPages';

export const OrderPrivacyPolicyAgreement = () => {
  return (
    <Text className="text-extra-small">
      当サイトの
      <TenantPageLink color="brand.primaryText" href={privacyPage} target="_blank" textDecoration={'underline'}>
        プライバシーポリシー
      </TenantPageLink>
      に同意の上「この内容で注文する」ボタンを押してください。
    </Text>
  );
};
