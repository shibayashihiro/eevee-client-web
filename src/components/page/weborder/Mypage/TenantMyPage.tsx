import { Container } from '@chakra-ui/react';
import { useMemo } from 'react';

import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAdditionalTypeNamesContext } from '@/graphql/helper';
import { Profile } from '@/graphql/generated/types';

import { useGetTenantMyPageQuery } from './TenantMyPage.query.generated';
import { ProfileHeader } from './ProfileHeader';
import { MyPageMenu, useMyPageMenuQueryContext } from './MyPageMenu';

export const TenantMyPage: NextPageWithLayout = () => {
  // マイページのメニュー表示に必要なtypeが変わったらrefetchする
  const myPageMenuQueryContext = useMyPageMenuQueryContext();
  // プロファイル情報が変わったらrefetchする
  const profileQueryContext = useAdditionalTypeNamesContext<[Profile]>(['Profile']);

  const context = useMemo(
    () => ({ ...myPageMenuQueryContext, ...profileQueryContext }),
    [myPageMenuQueryContext, profileQueryContext],
  );

  const [{ data, fetching, error }] = useGetTenantMyPageQuery({ context });

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }

  return (
    <NavigationHeaderLayout viewing={data.viewing} viewer={data.viewer} facility={null}>
      <Container maxW="full" py="24px" px={0} m={0}>
        <ProfileHeader user={data.viewer} />
        <MyPageMenu user={data.viewer} tenant={data.viewing} />
      </Container>
    </NavigationHeaderLayout>
  );
};
