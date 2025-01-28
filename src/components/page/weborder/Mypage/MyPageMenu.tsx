import { useCallback, useState } from 'react';
import { Box, useDisclosure, VStack } from '@chakra-ui/react';
import liff from '@line/liff';

import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { AccountWithdrawalDialog } from '@/components/domain/AccountWithdrawalDialog';
import { AccountWithdrawalCompletedDialog } from '@/components/domain/AccountWithdrawalCompletedDialog';
import { LogoutDialog } from '@/components/domain/LogoutDialog';
import { home, myPageCoupon, myPageOrderHistory, privacyPage } from '@/utils/paths/tenantPages';
import { generateMutationId, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { Coupon } from '@/graphql/generated/types';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useAuth } from '@/auth/provider/AuthProvider';

import { TenantForMyPageMenuFragment, UserForMyPageMenuFragment } from './MyPageMenu.fragment.generated';
import { MyPageMenuItem } from './MyPageMenuItem';
import { useSuspendUserMutation } from './MyPageMenu.mutation.generated';

type Props = {
  user: UserForMyPageMenuFragment;
  tenant: TenantForMyPageMenuFragment;
};

/**
 * マイページのメニュー表示にはクーポン情報が必要で、クーポンの更新を検知してクエリをリフレッシュする必要がある。
 * そのためのコンテキストを提供する。
 * @returns
 */
export const useMyPageMenuQueryContext = () => useAdditionalTypeNamesContext<[Coupon]>(['Coupon']);

export const MyPageMenu = ({ user, tenant }: Props) => {
  const { isAnonymous } = useAuthUser();
  return (
    <VStack align="stretch" spacing="32px">
      <UserMenuSection couponCount={user.coupons.nodes.length} />
      <TenantURLsSection tenant={tenant} />
      {/* LINEミニアプリの場合はログイン・ログアウトという概念はないため表示しない */}
      {!liff.isInClient() && !isAnonymous && <LoginLogOutSection />}
    </VStack>
  );
};

const MyPageMenuSection = ({ items }: { items: MenuItem[] }) => {
  return (
    <VStack as="ul" align="stretch" w="full" spacing={0} listStyleType="none">
      {items.map((item, i) => (
        <Box
          as="li"
          key={i}
          w="full"
          borderTop="1px"
          borderTopColor="mono.divider"
          _last={{
            borderBottom: '1px',
            borderBottomColor: 'mono.divider',
          }}
        >
          {item.type === 'link' ? (
            <MyPageMenuItem
              label={item.label}
              href={item.href}
              isExternal={item.isExternal}
              badgeCount={item.badgeCount}
            />
          ) : (
            <MyPageMenuItem label={item.label} onClick={item.onClick} badgeCount={item.badgeCount} />
          )}
        </Box>
      ))}
    </VStack>
  );
};

type MenuItem = MenuItemLink | MenuItemAction;

type MenuItemLink = {
  type: 'link';
  label: string;
  href: string;
  isExternal?: boolean;
  badgeCount?: number;
};

type MenuItemAction = {
  type: 'action';
  label: string;
  onClick: () => void;
  badgeCount?: number;
};

const UserMenuSection = ({ couponCount }: { couponCount: number }) => {
  const items: MenuItem[] = [
    { type: 'link', label: '所有クーポン', href: myPageCoupon, badgeCount: couponCount },
    { type: 'link', label: '注文履歴', href: myPageOrderHistory },
  ];
  return <MyPageMenuSection items={items} />;
};

const TenantURLsSection = ({ tenant }: { tenant: TenantForMyPageMenuFragment }) => {
  const { helpUrl, contactUrl, termsOfUseUrl, privacyPolicyUrl, specifiedCommercialTransactionActUrl } = tenant;
  const items: MenuItem[] = [
    { type: 'link', label: 'FAQ', href: helpUrl, isExternal: true },
    { type: 'link', label: 'お問い合わせ', href: contactUrl, isExternal: true },
    { type: 'link', label: '利用規約', href: termsOfUseUrl, isExternal: true },
    privacyPolicyUrl
      ? { type: 'link', label: 'プライバシーポリシー', href: privacyPolicyUrl, isExternal: true }
      : { type: 'link', label: 'プライバシーポリシー', href: privacyPage, isExternal: false },
    { type: 'link', label: '特定商取引法に基づく表記', href: specifiedCommercialTransactionActUrl, isExternal: true },
  ];
  return <MyPageMenuSection items={items} />;
};

const LoginLogOutSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isOpen: isLogoutDialogOpen, onOpen: openLogoutDialog, onClose: closeLogoutDialog } = useDisclosure();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const router = useTenantRouter();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [_, suspendUser] = useSuspendUserMutation();
  const { signOut } = useAuth();

  const handleConfirmWithdrawal = useCallback(async () => {
    const { error } = await suspendUser({
      input: {
        clientMutationId: generateMutationId(),
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    setIsDialogOpen(false);
    setShowCompletionDialog(true);
  }, [suspendUser, handleErrorWithAlertDialog]);
  const handleCompletionDialogClose = useCallback(async () => {
    await signOut();
    setShowCompletionDialog(false);
    router.replace(home);
  }, [router, signOut]);

  const items: MenuItem[] = [
    { type: 'action', label: 'ログアウト', onClick: openLogoutDialog },
    { type: 'action', label: '退会', onClick: () => setIsDialogOpen(true) },
  ];
  return (
    <>
      <MyPageMenuSection items={items} />
      <LogoutDialog isOpen={isLogoutDialogOpen} onClose={closeLogoutDialog} />
      <AccountWithdrawalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmWithdrawal}
      />
      <AccountWithdrawalCompletedDialog isOpen={showCompletionDialog} onClose={handleCompletionDialogClose} />
    </>
  );
};
