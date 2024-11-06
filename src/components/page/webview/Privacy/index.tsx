import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { PrivacyPolicy } from '@/components/domain/PrivacyPolicy';
import { containerMarginX } from '@/utils/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useGetPrivacyPolicyInfoForWebviewQuery } from './privacy.query.generated';

const PrivacyPage: NextPageWithLayout = () => {
  const router = useRouter();
  const tenantUid = router.query.tenantId;

  const [{ data, fetching, error }] = useGetPrivacyPolicyInfoForWebviewQuery();

  if (typeof tenantUid !== 'string') {
    return <div>ページを読み込めませんでした</div>;
  }
  if (error) {
    throw error;
  }
  if (fetching) {
    return <LoadingSpinner />;
  }

  const tenant = data?.tenant;
  if (!tenant) {
    throw new Error('Failed to fetch data');
  }

  return (
    <Box mx={containerMarginX} my="40px">
      <PrivacyPolicy
        tenantUid={tenantUid}
        specifiedCommercialTransactionActUrl={tenant.specifiedCommercialTransactionActUrl}
      />
    </Box>
  );
};

export default PrivacyPage;
