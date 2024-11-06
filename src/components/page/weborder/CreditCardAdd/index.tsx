import { useCallback } from 'react';
import { Box } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { CreditCardForm } from '@/components/domain/CreditCardForm';
import { containerMarginX } from '@/utils/constants';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

const CreditCardAddPage: NextPageWithLayout = () => {
  const router = useTenantRouter();

  const handleClickBackIcon = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <InsideNavbar title="クレジットカードを新規追加" onClickBackIcon={handleClickBackIcon} />
      <Box mx={containerMarginX} mt="40px">
        <CreditCardForm />
      </Box>
    </>
  );
};

export default CreditCardAddPage;
