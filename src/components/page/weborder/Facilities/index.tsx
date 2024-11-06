import { useCallback, useState } from 'react';
import { Spinner, VStack } from '@chakra-ui/react';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { InputSearch } from '@/components/ui/Input/InputSearch';
import { useGeolocation } from '@/hooks/useGeoLocation';
import { FacilityList } from '@/components/domain/FacilityList';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

const FacilitiesPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [searchText, setSearchText] = useState('');

  const { currentPosition, loaded } = useGeolocation();

  const handleClickBackIcon = useCallback(() => {
    router.back();
  }, [router]);

  const handleChangeSearchText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  return (
    <>
      <InsideNavbar title="店舗選択" onClickBackIcon={handleClickBackIcon} />

      <VStack mx={containerMarginX} pt="24px" spacing="10px" mb="40px">
        <InputSearch placeholder="店名・住所からさがす" onChange={handleChangeSearchText} disabled={!loaded} />
        {!loaded ? (
          <Spinner className="mono-secondary" />
        ) : (
          <FacilityList location={currentPosition} searchText={searchText} />
        )}
      </VStack>
    </>
  );
};

export default FacilitiesPage;
