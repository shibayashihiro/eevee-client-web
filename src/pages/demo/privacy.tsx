import { Box } from '@chakra-ui/react';

import { PrivacyPolicyContentLatest } from '@/components/domain/PrivacyPolicy/PrivacyPolicyContent/PrivacyPolicyContentLatest';
import { DemoLayout } from '@/components/layouts/DemoLayout';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';

const PrivacyDemo: NextPageWithLayout = () => {
  return (
    <Box my="6" mx={containerMarginX}>
      <PrivacyPolicyContentLatest
        specifiedCommercialTransactionActUrl=""
        lineAppName=" {アプリ名} "
        companyName=" {会社または事業者の名称} "
        companyAddress=" {会社または事業者の住所} "
      />
    </Box>
  );
};

PrivacyDemo.getLayout = DemoLayout;

export default PrivacyDemo;
