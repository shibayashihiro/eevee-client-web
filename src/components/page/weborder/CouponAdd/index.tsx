import { useCallback } from 'react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { CouponForm } from '@/components/domain/CouponForm';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

const CouponAddPage: NextPageWithLayout = () => {
  const router = useTenantRouter();

  const handleClickBackIcon = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <InsideNavbar title="クーポンコードから追加" onClickBackIcon={handleClickBackIcon} />
      <CouponForm />
    </>
  );
};

export default CouponAddPage;
