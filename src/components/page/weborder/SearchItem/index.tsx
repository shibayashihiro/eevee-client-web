import { Box, HStack, Spacer, Text, VStack } from '@chakra-ui/react';

import { SearchItemForm } from '@/components/domain/SearchItemForm';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { FacilityName } from '@/components/ui/FacilityName';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isFacility } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { TableNumber } from '@/components/ui/TableNumber';
import { TableCourseMenuStatsHeader } from '@/components/domain/TableCourseMenuStatsHeader';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar';
import { OrderType } from '@/graphql/generated/types';
import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';

import { useGetSearchItemPageQuery } from './SearchItem.query.generated';

const SearchItemPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  const orderType = OrderType.EatIn;

  const [{ data, fetching, error }] = useGetSearchItemPageQuery({
    variables: {
      facilityID: facilityId,
      orderType: orderType,
    },
  });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }

  if (!data || !data.facility || !isFacility(data.facility)) {
    throw new Error('not found');
  }
  return (
    <FeatureFlagsProvider featureFlags={data.facility.featureFlags}>
      <NavigationHeaderLayout
        viewing={data.viewing}
        viewer={data.viewer}
        facility={data.facility}
        orderType={orderType}
        showOrderHistory={true}
        showTableOrderPayment={false}
        itemSearchMethodButtonType={ItemSearchMethodButtonType.ShowItemList}
      >
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {data.viewer.table && <TableCourseMenuStatsHeader table={data.viewer.table} />}
          <Box as="main" mx="20px" flex="1">
            <HStack mt="18px" mb="40px" w="full" alignItems="center">
              <FacilityName facilityName={data.facility.shortName} />
              <Spacer />
              {data.viewer.table && <TableNumber tableName={(data.viewer.table as { name: string }).name} />}
            </HStack>
            <SearchItemsView />
          </Box>
          <FixedCartFooterButton orderType={orderType} cart={data.viewer.cart} isTableOrder={true} />
        </Box>
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

const SearchItemsView = () => {
  return (
    <Box>
      <VStack spacing={4} align="start">
        <Text className="bold-large">番号を入力</Text>
        <Text className="text-small">メニュー表にある番号を入力してください</Text>
        <SearchItemForm />
      </VStack>
    </Box>
  );
};

export default SearchItemPage;
