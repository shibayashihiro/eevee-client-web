import { Box, Center, Button, Spacer, Select, HStack } from '@chakra-ui/react';
import { OrderedList, ListItem, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { containerMarginX } from '@/utils/constants';
import { couponAddPage } from '@/utils/paths/tenantPages';
import { NoData } from '@/components/ui/NoData';
import { CouponIcon } from '@/components/ui/Icons/CouponIcon';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { AvailableCoupon, UnavailableCoupon } from '@/components/domain/CouponCard';
import { CouponCardForListFragment } from '@/components/domain/CouponCard/CouponCard.fragment.generated';
import variables from '@/styles/variables.module.scss';

import { useGetMyCouponsQuery } from './MyCoupons.fragment.generated';

export const MyCouponsPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [sortOption, setSortOption] = useState<string>('newest');

  const isAvailable = tabIndex === 0;
  const handleClickBackIcon = useCallback(async () => {
    router.back();
  }, [router]);

  const handleClickTrailing = useCallback(async () => {
    await router.push(couponAddPage);
  }, [router]);
  const [{ data, fetching, error }] = useGetMyCouponsQuery({
    variables: {
      first: 100, // 仮で100をセット。今後ユーザーのクーポン所持数が増えるようであれば修正すること
      after: null,
      isAvailable: isAvailable,
    },
    requestPolicy: 'network-only',
  });

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }

  const { viewer } = data;

  const coupons = viewer.coupons.nodes;
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
  };

  const sortedAndFilteredCoupons = coupons
    .sort((a, b) => {
      const getExpiryDate = (coupon: CouponCardForListFragment) =>
        new Date(coupon.details.find((detail) => detail.name === '有効期限')?.value || '').getTime();

      if (sortOption === 'newest') {
        return getExpiryDate(b) - getExpiryDate(a);
      } else if (sortOption === 'oldest') {
        return getExpiryDate(a) - getExpiryDate(b);
      } else if (sortOption === 'expiringSoon') {
        const now = new Date().getTime();
        return getExpiryDate(a) - now - (getExpiryDate(b) - now);
      }
      return 0;
    });

  return (
    <>
      <InsideNavbar title="所有クーポン" onClickBackIcon={handleClickBackIcon} />
      <Box maxW={variables.containerMaxWidth} mx="auto">
        <Box
          py="18px"
          textAlign="right"
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          borderBottomColor="mono.divider"
          px={containerMarginX}
        >
          <Button variant="link" onClick={handleClickTrailing} textStyle="bold-small" textColor="mono.secondary">
            コードから追加
          </Button>
        </Box>
        <Spacer />
        <Tabs variant="soft-rounded" index={tabIndex} onChange={(index) => setTabIndex(index)} isLazy isFitted>
          <TabList borderRadius="16px" bgColor="mono.backGround" mt="24px" mx={containerMarginX}>
            <Tab
              _selected={{ bg: 'mono.white' }}
              m="4px"
              h="40px"
              borderRadius="12px"
              textStyle="bold-extra-small"
              color="mono.primary"
            >
              利用可能
            </Tab>
            <Tab
              _selected={{ bg: 'mono.white' }}
              m="4px"
              h="40px"
              borderRadius="12px"
              textStyle="bold-extra-small"
              color="mono.primary"
            >
              利用済/期限切れ
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={containerMarginX} py="24px">
              <FilterControls
                sortOption={sortOption}
                onSortChange={handleSortChange} 
              />
              <MyCouponList coupons={sortedAndFilteredCoupons} />
            </TabPanel>
            <TabPanel px={containerMarginX} py="24px">
              <FilterControls
                sortOption={sortOption}
                onSortChange={handleSortChange}                
              />
              <MyCouponList coupons={sortedAndFilteredCoupons} isExpired />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

const CouponNotFound = () => {
  return (
    <Center py="154px" px={containerMarginX}>
      <NoData icon={<CouponIcon boxSize="64px" />} message="クーポンはありません" />
    </Center>
  );
};
const FilterControls = ({
  sortOption,
  onSortChange,
}: {
  sortOption: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <HStack spacing="16px">
    <Select
      placeholder="並び順"
      background="mono.white"
      borderRadius="full"
      w="auto"
      value={sortOption}
      onChange={onSortChange}
      focusBorderColor="mono.hint"
    >
      <option value="newest">最新順</option>
      <option value="oldest">古い順</option>
      <option value="expiringSoon">期限が近い順</option>
    </Select>    
  </HStack>
);
const MyCouponList = ({
  coupons,
  isExpired = false,
}: {
  coupons: CouponCardForListFragment[];
  isExpired?: boolean;
}) => (
  <Box>
    {coupons.length === 0 ? (
      <CouponNotFound />
    ) : (
      <OrderedList styleType="none" w="full" ml={0}>
        {coupons.map((coupon) => (
          <ListItem pt="24px" key={coupon.id}>
            {isExpired ? <UnavailableCoupon coupon={coupon} /> : <AvailableCoupon coupon={coupon} />}
          </ListItem>
        ))}
      </OrderedList>
    )}
  </Box>
);
