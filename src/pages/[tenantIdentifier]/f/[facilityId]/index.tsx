import { ParsedUrlQuery } from 'querystring';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

type ExpectedQuery = {
  tenantIdentifier: string;
  facilityId: string;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  const { tenantIdentifier, facilityId } = query;
  if (typeof tenantIdentifier !== 'string' || typeof facilityId !== 'string') {
    return false;
  }
  return true;
};

const FacilityIndex: NextPage = () => {
  // ここはWebOrderLayoutに依存せずピュアに実装したいためTenantRouterは使わない
  const router = useRouter();
  const { isReady, query } = router;

  useEffect(() => {
    if (isReady) {
      if (!isValidQuery(query)) {
        throw new Error('invalid path');
      }
      const { tenantIdentifier, facilityId } = query;
      // 元々 EatIn 機能のみの想定で実装しており、 '/' を EatIn として既にQR Codeも一部で利用しているためこのようにする。
      router.replace(`/${tenantIdentifier}/f/${facilityId}/eatin`);
    }
  }, [isReady, query, router]);

  return null;
};

export default FacilityIndex;
