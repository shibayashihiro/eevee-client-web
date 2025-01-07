import { Container } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { UserProfileForm } from '@/components/domain/UserProfileForm';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useSimpleToast } from '@/components/ui/toast/SimpleToast';
import { myPage } from '@/utils/paths/tenantPages';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';

import { useGetUserProfileSettingFieldsQuery } from './ProfileSetting.query.generated';

export const ProfileSettingPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { isAnonymous } = useAuthUser();
  const [{ data, error, fetching }] = useGetUserProfileSettingFieldsQuery({
    requestPolicy: 'network-only',
  });
  const showToast = useSimpleToast();

  const goBack = useCallback(async () => {
    router.push(myPage);
  }, [router]);

  const onSubmitted = useCallback(() => {
    showToast('プロフィールを更新しました');
    router.push(myPage);
  }, [router, showToast]);

  useEffect(() => {
    if (isAnonymous) {
      router.replace(myPage);
    }
  }, [isAnonymous, router]);

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data || data.tenant.userProfileInputFields.length === 0) {
    throw new Error('Data not found');
  }

  const profile = data?.viewer.profile;

  const initialValues = {
    displayName: profile?.displayName ?? undefined,
    lastNameKana: profile?.lastNameKana ?? undefined,
    birthDate: profile?.birthDate ?? undefined,
    gender: profile?.gender ?? undefined,
  };

  return (
    <>
      <InsideNavbar title="プロフィールの設定" onClickBackIcon={goBack} />
      <Container as="main" py="24px">
        <UserProfileForm
          tenant={data.tenant}
          initialValues={initialValues}
          onSubmitted={onSubmitted}
          onClickSetupLater={goBack}
        />
      </Container>
    </>
  );
};
