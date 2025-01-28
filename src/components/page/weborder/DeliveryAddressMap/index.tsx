import { useCallback, useEffect, useState, useMemo } from 'react';
import { Box, Container, VStack, Text, HStack, Icon, useDisclosure } from '@chakra-ui/react';
import { HelpOutline } from '@mui/icons-material';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { DeliveryAddressMap } from '@/components/domain/DeliveryAddressMap';
import { InputAddresses } from '@/components/domain/DeliveryAddressAdd/InputAddresses';
import { AddressInfoDialog } from '@/components/domain/AddressInfoDialog';
import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { deliveryHome } from '@/utils/paths/facilityPages';
import { containerMarginX } from '@/utils/constants';

type Coordinates = {
  lat: number;
  lng: number;
};
interface Address {
  __typename: string;
  prefecture: string;
  addressLine: string;
  latitude: number;
  longitude: number;
}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};
const DeliveryAddressAddPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { lat, lng } = router.query;
  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [address, setAddress] = useState<Address>({
    __typename: '',
    prefecture: '',
    addressLine: '',
    latitude: 0,
    longitude: 0,
  });
  const [showInputForm, setShowInputForm] = useState(false);

  const handleClickBackIcon = useCallback(() => {
    if (showInputForm) {
      setShowInputForm(false);
    } else {
      router.back();
    }
  }, [router, showInputForm]);

  const isValid = useMemo(() => {
    return !!address.prefecture && !!address.addressLine;
  }, [address]);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setCoordinates({ lat: latitude, lng: longitude });
        getAddressFromCoordinates(latitude, longitude).then((currentAddress) => {
          setAddress(currentAddress);
        });
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates({ lat: latitude, lng: longitude });
              const currentAddress = await getAddressFromCoordinates(latitude, longitude);
              setAddress(currentAddress);
            },
            () => {
              alert('位置情報を取得できませんでした。');
            },
          );
        } else {
          alert('このブラウザでは位置情報はサポートされていません。');
        }
      }
    };

    getCurrentLocation();
  }, [latitude, longitude]);

  async function getAddressFromCoordinates(lat: number, lng: number): Promise<Address> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&language=ja`,
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        let prefecture = '';
        let restOfAddress = '';

        addressComponents.forEach((component: AddressComponent) => {
          const types = component.types;
          if (types.includes('administrative_area_level_1')) {
            prefecture = component.long_name;
          } else if (types.includes('premise')) {
            if (component.long_name.match(/^[0-9０-９]+/)) {
              restOfAddress = `${component.long_name} ${restOfAddress}`;
            } else {
              restOfAddress = `${component.long_name} ${restOfAddress}`;
            }
          } else if (
            types.includes('sublocality') ||
            types.includes('route') ||
            types.includes('street_address') ||
            types.includes('locality')
          ) {
            if (types.includes('sublocality_level_4')) {
              restOfAddress = `${component.long_name} − ${restOfAddress}`;
            } else {
              restOfAddress = `${component.long_name} ${restOfAddress}`;
            }
          }
        });
        return { __typename: 'Address', prefecture, addressLine: restOfAddress.trim(), latitude: lat, longitude: lng };
      } else {
        return {
          __typename: 'Address',
          prefecture: '都道府県が見つかりません。',
          addressLine: '住所が見つかりません。',
          latitude: lat,
          longitude: lng,
        };
      }
    } catch {
      return {
        __typename: 'Address',
        prefecture: 'エラーが発生しました。',
        addressLine: '住所を取得できませんでした。',
        latitude: lat,
        longitude: lng,
      };
    }
  }

  const handleMapClick = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    const newAddress = await getAddressFromCoordinates(lat, lng);
    setAddress(newAddress);
  };

  const handleClickNext = () => {
    if (isValid) {
      setShowInputForm(true);
    }
  };
  const handleSubmitAddress = (assignedFacilityId: string) => {
    router.push(deliveryHome(assignedFacilityId));
  };

  if (!coordinates) return <LoadingSpinner />;

  const handleAddressInfoClick = () => {
    onOpen();
  };
  return (
    <>
      <InsideNavbar
        title={showInputForm ? '配達先の設定' : 'お届け先住所をマップ上でタップまたはクリックしてください'}
        onClickBackIcon={handleClickBackIcon}
      />
      <Container as="main">
        {!showInputForm ? (
          <>
            <VStack alignItems="start" mx="20px" my="16px" spacing="8px">
              <HStack justifyContent="space-between" w="full">
                <Text className="bold-extra-small" color="mono.secondary">
                  お届け先住所
                </Text>
                <WrappedLink
                  display="flex"
                  href="#"
                  onClick={handleAddressInfoClick}
                  style={{ textDecoration: 'none' }}
                >
                  <HStack spacing="0">
                    <Icon as={HelpOutline} boxSize="16px" />
                    <Text className="bold-extra-small">表示される住所情報が異なる場合</Text>
                  </HStack>
                </WrappedLink>
              </HStack>
              <Text className="bold-normal" w="full" textAlign="start">
                {`${address.prefecture} ${address.addressLine}`}
              </Text>
            </VStack>
            <Box mx="auto" mt="0px" height={{ base: '54vh', md: '60vh' }}>
              <DeliveryAddressMap coordinates={coordinates} onMapClick={handleMapClick} />
            </Box>
            <VStack
              px="20px"
              py="16px"
              bgColor="mono.white"
              borderTop="1px"
              borderTopColor="mono.divider"
              align="center"
              position="sticky"
              zIndex="sticky"
              bottom="0"
            >
              <PrimaryButton h="56px" disabled={!isValid} onClick={handleClickNext}>
                次へ
              </PrimaryButton>
            </VStack>
          </>
        ) : (
          <Box pb="32px" px={containerMarginX}>
            <InputAddresses
              initialValue={{
                prefecture: address.prefecture,
                addressLine: address.addressLine,
                latLng: { latitude: address.latitude, longitude: address.longitude },
              }}
              onSubmit={handleSubmitAddress}
            />
          </Box>
        )}
      </Container>
      <AddressInfoDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default DeliveryAddressAddPage;
