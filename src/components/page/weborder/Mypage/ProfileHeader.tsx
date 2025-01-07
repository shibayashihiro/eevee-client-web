import { FC, useCallback } from 'react';
import { HStack, Text } from '@chakra-ui/react';

import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { PrimaryButton } from '@/components/ui/Button';
import { safeUserNameForDisplay } from '@/utils/domain/user';
import { myPageProfileSetting } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { MyPageProfileHeaderFragment } from './ProfileHeader.fragment.generated';

type Props = {
  user: MyPageProfileHeaderFragment;
};
export const ProfileHeader: FC<Props> = ({ user }: Props) => {
  const { isAnonymous } = useAuthUser();
  const router = useTenantRouter();
  const name = safeUserNameForDisplay(isAnonymous, user.profile?.lastNameKana);
  const onClick = useCallback(async () => {
    await router.push(myPageProfileSetting);
  }, [router]);

  return (
    <HStack
      as="header"
      w="full"
      bg="mono.white"
      px="20px"
      pt="0"
      pb="24px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text textStyle="bold-large" color="mono.primary">
        {name}
      </Text>
      {!isAnonymous && (
        <PrimaryButton w="min-content" h="33px" onClick={onClick}>
          プロフィールの設定
        </PrimaryButton>
      )}
    </HStack>
  );
};
