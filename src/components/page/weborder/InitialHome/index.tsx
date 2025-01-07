import { UrlObject } from 'url';
import { ParsedUrlQuery } from 'querystring';

import { Box, HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ComponentProps, useCallback } from 'react';
import router from 'next/router';

import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { ActionKeyIcon } from '@/components/ui/Icons/ActionKeyIcon';
import { NumberSearchIcon } from '@/components/ui/Icons/PinIcon';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NextLink } from '@/components/ui/NextLink';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { OrderType } from '@/graphql/generated/types';
import { isFacility } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { deliveryHome, eatInHome, searchItemPage, takeoutHome } from '@/utils/paths/facilityPages';
import { setItemCodeForSearchMethod, setItemListForSearchMethod } from '@/utils/localstorage/item_search_method';

import { useGetInitialHomePageQuery } from './InitialHome.query.generated';

type ExpectedQuery = {
  orderType: OrderType;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  if (
    query.orderType !== OrderType.EatIn &&
    query.orderType !== OrderType.Delivery &&
    query.orderType !== OrderType.Takeout
  ) {
    return false;
  }
  return true;
};

const InitialHomePage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();
  const { ...queryParams } = router.query;
  const valid = isValidQuery(queryParams);
  if (!valid) {
    throw new Error('ini: invalid query');
  }
  let { orderType } = queryParams;

  const [{ data, fetching, error }] = useGetInitialHomePageQuery({
    variables: {
      facilityId: facilityId,
    },
  });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }

  if (!data || !data.facility || !isFacility(data.facility) || !data.facility.availableOrderTypes) {
    throw new Error('not found');
  }

  if (!orderType) {
    orderType = data.facility.availableOrderTypes[0].orderType; //これをページごとに切り替える
  }
  return (
    <FeatureFlagsProvider featureFlags={data.facility.featureFlags}>
      <NavigationHeaderLayout
        viewing={data.viewing}
        viewer={data.viewer}
        facility={data.facility}
        orderType={orderType}
      >
        <InitialHomeView facilityId={facilityId} orderType={orderType} />
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

const InitialHomeView = ({ facilityId, orderType }: { facilityId: string; orderType: OrderType }) => {
  const resolveFacilityHomePage = useCallback((facilityId: string, orderType: OrderType): string => {
    switch (orderType) {
      case OrderType.Delivery:
        return deliveryHome(facilityId);
      case OrderType.Takeout:
        return takeoutHome(facilityId);
      case OrderType.EatIn:
        return eatInHome(facilityId);
    }
  }, []);

  return (
    <Box pt={8} px={5}>
      <Text className="bold-3xl" mb={4}>
        ご来店ありがとうございます
      </Text>
      <Text mb={2} className="bold-large">
        注文の方法を選択してください
      </Text>
      <Text mb={8} className="text-medium">
        選択後も切り替えができます
      </Text>
      <CardForHome
        title="番号を入力"
        description="メニュー番号を入力して商品を注文する"
        icon={NumberSearchIcon}
        onClickSet={() => setItemCodeForSearchMethod()}
        href={searchItemPage(facilityId, orderType)}
      />
      <Spacer mb={4} />
      <CardForHome
        title="写真から選ぶ"
        description="写真を見ながら商品を探して注文する"
        icon={ActionKeyIcon}
        onClickSet={() => setItemListForSearchMethod()}
        href={resolveFacilityHomePage(facilityId, orderType)}
      />
    </Box>
  );
};

const CardForHome: React.FC<{
  title: string;
  description: string;
  icon: (props: ComponentProps<typeof Icon>) => JSX.Element;
  href: string | UrlObject;
  onClickSet: () => void;
}> = ({ title, description, icon, href, onClickSet }) => {
  return (
    <Box pl={4} pr={2} py="25px" borderWidth="1px" borderRadius="lg" overflow="hidden" onClick={onClickSet}>
      <WrappedLink as={NextLink} href={href}>
        <HStack spacing={4} align="stretch">
          <Icon as={icon} color="brand.primary" boxSize={10} />
          <VStack align="start" spacing={0}>
            <Text className="bold-large">{title}</Text>
            <Text className="text-extra-small">{description}</Text>
          </VStack>
          <Spacer />
          <Icon color="brand.primary" as={ChevronRightIcon} boxSize={10} />
        </HStack>
      </WrappedLink>
    </Box>
  );
};

export default InitialHomePage;
