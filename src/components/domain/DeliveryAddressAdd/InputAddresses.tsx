import { FC, useCallback, useMemo, useReducer } from 'react';
import { HStack, Icon, VStack, Text, useDisclosure, Box, FormLabel } from '@chakra-ui/react';
import { HelpOutline } from '@mui/icons-material';

import { InputWithLabel } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { TextareaWithLabel } from '@/components/ui/TextareaWithLabel';
import { deliveryAddressAddPage } from '@/utils/paths/tenantPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { AddressInfoDialog } from '../AddressInfoDialog';
import { TenantPageLink } from '../TenantPageLink';

import { useAddDeliveryAddressMutation } from './DeliveryAddressAdd.mutation.generated';

type InputAddressesInitializeParts = {
  prefecture: string;
  addressLine: string;
  latLng: { latitude: number; longitude: number };
};

type Props = {
  initialValue: InputAddressesInitializeParts;
  onSubmit: (assignedFacilityId: string) => void;
};

type FormState = {
  prefecture: string;
  address1: string;
  address2: string;
  deliveryNote: string;
  latitude: number;
  longitude: number;
};

const init = ({
  prefecture,
  addressLine,
  latLng: { latitude, longitude },
}: InputAddressesInitializeParts): FormState => ({
  prefecture: prefecture,
  address1: addressLine,
  address2: '',
  deliveryNote: '',
  latitude: latitude,
  longitude: longitude,
});

type ActionTypes = 'setPrefecture' | 'setAddress1' | 'setAddress2' | 'setDeliveryNote';
type Action = {
  type: ActionTypes;
  payload: string;
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'setPrefecture':
      return { ...state, prefecture: action.payload };
    case 'setAddress1':
      return { ...state, address1: action.payload };
    case 'setAddress2':
      return { ...state, address2: action.payload };
    case 'setDeliveryNote':
      return { ...state, deliveryNote: action.payload };
    default:
      return state;
  }
};

export const InputAddresses: FC<Props> = ({ initialValue, onSubmit }) => {
  const router = useTenantRouter();
  const [state, dispatch] = useReducer(reducer, initialValue, init);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [result, addDeliveryAddress] = useAddDeliveryAddressMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const plaFromUrl = router.query.pla as string;
  useLoadingOverlay(result.fetching);

  const isValid = useMemo(() => {
    return state.prefecture !== '' && state.address1 !== '';
  }, [state.address1, state.prefecture]);

  const handleChangeAddress2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setAddress2', payload: e.target.value });
  }, []);

  const handleChangeDeliveryNote = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'setDeliveryNote', payload: e.target.value });
  }, []);

  const handleAddressInfoClick = () => {
    onOpen();
  };

  const handleClickRegister = useCallback(async () => {
    const { prefecture, address1, address2, deliveryNote } = state;
    if (!isValid) {
      return;
    }
    const { data, error } = await addDeliveryAddress({
      input: {
        prefecture,
        addressLine: address1,
        buildingName: address2,
        memo: deliveryNote,
        latLng: initialValue.latLng,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    if (!data?.addDeliveryAddress?.assignedFacilityId) {
      handleErrorWithAlertDialog(new Error('配送先の登録に失敗しました'));
      return;
    }
    onSubmit(data.addDeliveryAddress.assignedFacilityId);
  }, [state, isValid, initialValue.latLng, addDeliveryAddress, onSubmit, handleErrorWithAlertDialog]);

  return (
    <>
      <VStack mt="24px" spacing="24px">
        <InputWithLabel w="full" id="prefecture" label="都道府県" value={state.prefecture} disabled />
        <VStack w="full" spacing="12px">
          <VStack w="full" alignItems="start" spacing="4px">
            <FormLabel mb="0" fontWeight="bold" fontSize="extra-small" color="mono.secondary">
              市区町村、番地
            </FormLabel>
            <Box w="full" bg="mono.backGroundLight" p="12px" borderRadius="8px">
              <HStack w="full" justifyContent="space-between" align="center">
                <Text className="bold-medium" color="mono.secondary" userSelect="text">
                  {state.address1 ? state.address1 : '渋谷区円山町28-1'}
                </Text>
                <Text w="110px" className="text-small" color="mono.primary" align="right">
                  <TenantPageLink href={deliveryAddressAddPage('', plaFromUrl || '')}>修正する</TenantPageLink>
                </Text>
              </HStack>
            </Box>
          </VStack>
          <WrappedLink
            alignSelf="flex-end"
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
        </VStack>
        <InputWithLabel
          w="full"
          id="address2"
          label="マンション・建物名、部屋番号・階数 (任意)"
          placeholder="シン渋谷 501"
          value={state.address2}
          onChange={handleChangeAddress2}
        />
        <TextareaWithLabel
          w="full"
          h="120px"
          id="deliveryNote"
          label="配達時の注意点メモ (任意)"
          placeholder="緑色の外壁のマンションです。入り口は大通り側にあります。玄関前に置き配でお願いします"
          onChange={handleChangeDeliveryNote}
        />

        <PrimaryButton h="56px" disabled={!isValid} onClick={handleClickRegister}>
          登録する
        </PrimaryButton>
      </VStack>
      <AddressInfoDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};
