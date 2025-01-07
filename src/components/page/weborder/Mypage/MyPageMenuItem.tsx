import React, { FC } from 'react';
import { LinkBox, HStack, Text, Badge } from '@chakra-ui/react';

import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { TenantPageLinkOverlay } from '@/components/domain/TenantPageLink';

type Props = {
  label: string;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
  // 0以上の場合にバッジを表示する
  badgeCount?: number;
};

export const MyPageMenuItem: FC<Props> = ({ label, href, isExternal, onClick, badgeCount }) => {
  const isClickable = !!onClick || !!href;

  return (
    <LinkBox
      w="full"
      alignItems="center"
      onClick={onClick}
      cursor={isClickable ? 'pointer' : undefined}
      role={onClick ? 'button' : undefined}
    >
      {href ? (
        <TenantPageLinkOverlay href={href} isExternal={isExternal}>
          <MenuItemLinkLayout label={label} badgeCount={badgeCount} />
        </TenantPageLinkOverlay>
      ) : (
        <MenuItemLinkLayout label={label} badgeCount={badgeCount} />
      )}
    </LinkBox>
  );
};

const MenuItemLinkLayout = ({ label, badgeCount }: { label: string; badgeCount?: number }) => {
  return (
    <HStack w="full" alignItems="center" justifyContent="space-between" py="17px" pr="12px">
      <HStack>
        <Text as="span" textStyle="text-normal" ml="20px" color="mono.primary">
          {label}
        </Text>
        {badgeCount && <MenuItemBadge count={badgeCount} />}
      </HStack>
      <RightIcon boxSize="20px" color="mono.hint" />
    </HStack>
  );
};

const MenuItemBadge = ({ count }: { count: number }) => (
  <Badge
    bg="brand.primary"
    variant="subtle"
    borderRadius="16px"
    h="20px"
    minW="20px"
    alignItems="center"
    justifyContent="center"
    display="inline-flex"
  >
    <Text size="16px" className="bold-extra-small" color="mono.white">
      {count}
    </Text>
  </Badge>
);
