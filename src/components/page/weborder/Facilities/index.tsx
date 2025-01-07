import { useCallback, useState } from 'react';
import { Spinner, VStack, Text, Select } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { InputSearch } from '@/components/ui/Input/InputSearch';
import { useGeolocation } from '@/hooks/useGeoLocation';
import { FacilityList } from '@/components/domain/FacilityList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import variables from '@/styles/variables.module.scss';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useGetWebHomeSectionsForTenantPageQuery } from '../TenantHome/TenantHome.query.generated';

const FacilitiesPage: NextPageWithLayout = () => {
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState<'nearest' | 'farthest'>('nearest');
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { currentPosition, loaded } = useGeolocation();
  const [result] = useGetWebHomeSectionsForTenantPageQuery();

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);

  const handleChangeSearchText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'nearest' | 'farthest');
  };

  if (error) {
    handleErrorWithAlertDialog(error);
    return null;
  }

  if (fetching || !data) {
    return <LoadingSpinner />;
  }
  return (
    <NavigationHeaderLayout viewing={data.viewing} viewer={data.viewer} facility={null}>
      <VStack
        mx="auto"
        px={containerMarginX}
        pt="24px"
        spacing="10px"
        mb="40px"
        maxW={variables.containerMaxWidth}
        align="start"
      >
        <Text className="bold-large">お持ち帰りのご注文</Text>
        <InputSearch placeholder="店名・住所からさがす" onChange={handleChangeSearchText} disabled={!loaded} />
        <Select
          background="mono.white"
          borderRadius="full"
          w="auto"
          value={sortOption}
          onChange={handleSortOptionChange}
          focusBorderColor="brand.primary"
          textColor="brand.primary"
          color="brand.primary"
          borderColor="brand.primary"
          sx={{
            ':hover': {
              borderColor: 'brand.primary',
            },
            paddingRight: '30px',
          }}
        >
          <option value="nearest">現在地から近い順</option>
          <option value="farthest">現在地から遠い順</option>
        </Select>

        {!loaded ? (
          <Spinner className="mono-secondary" />
        ) : (
          <FacilityList location={currentPosition} searchText={searchText} sortOption={sortOption} />
        )}
      </VStack>
    </NavigationHeaderLayout>
  );
};

export default FacilitiesPage;
