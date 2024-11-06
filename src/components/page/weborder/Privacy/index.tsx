import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next';
import { Box } from '@chakra-ui/react';

import { createClient } from '@/graphql/client';
import { getAuth } from '@/auth';
import { containerMarginX } from '@/utils/constants';
import { PrivacyPolicy } from '@/components/domain/PrivacyPolicy';
import { NextPageWithLayout } from '@/types';
import { apps } from '@/apps';

import { GetPrivacyPageDataDocument, GetPrivacyPageDataQuery } from './privacy.query.generated';

type DataForPrivacy = {
  tenantUid: string;
  specifiedCommercialTransactionActUrl: string;
  lineAppName: string;
  companyName: string;
  companyAddress: string;
};

export const getStaticPaths = (async () => {
  const paths = apps.identifiers.map((identifier) => ({ params: { tenantIdentifier: identifier } }));
  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

/**
 * プライバシーポリシーページのデータを取得する
 *
 * LINEのプライバシーポリシーを表示する時には、「現在開いているLINEアプリ」の情報が必要になるが、
 * 新しいウィンドウでページを開いた場合には、その情報が取得できないため、
 * ビルド時に静的な情報として完結させる。
 */
export const getStaticProps = (async ({ params }) => {
  const tenantIdentifier = params?.tenantIdentifier;
  if (typeof tenantIdentifier !== 'string') {
    throw new Error('Invalid tenant identifier');
  }
  const cfg = apps.getConfig(tenantIdentifier);
  if (!cfg) {
    throw new Error('Invalid tenant identifier');
  }

  const auth = getAuth(cfg.firebaseAuthProject ?? 'default');

  // APIは認証を必須とするため、ダサいがここで匿名認証しておく
  await auth.signInAnonymously();
  const client = createClient({ tenantId: cfg.tenantUidHeader, auth, liffId: cfg.liffId });
  const { data, error } = await client.query<GetPrivacyPageDataQuery>(GetPrivacyPageDataDocument, {}).toPromise();
  if (error || !data?.viewing) {
    console.warn('Failed to fetch data', error);
    throw error;
  }
  const { specifiedCommercialTransactionActUrl, lineAppName, companyName, companyAddress } = data.viewing;
  return {
    props: {
      data: {
        tenantUid: cfg.tenantUidHeader,
        specifiedCommercialTransactionActUrl,
        lineAppName,
        companyName,
        companyAddress,
      },
    },
  };
}) satisfies GetStaticProps<{
  data: DataForPrivacy;
}>;

export const PrivacyPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data: { tenantUid, specifiedCommercialTransactionActUrl, lineAppName, companyName, companyAddress },
}) => {
  return (
    <Box my={6} mx={containerMarginX}>
      <PrivacyPolicy
        tenantUid={tenantUid}
        specifiedCommercialTransactionActUrl={specifiedCommercialTransactionActUrl}
        appInfoForLINE={{ lineAppName, companyName, companyAddress }}
      />
    </Box>
  );
};
