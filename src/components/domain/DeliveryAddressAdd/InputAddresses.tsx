import { FC, useCallback, useMemo, useReducer } from 'react';
import { VStack } from '@chakra-ui/react';

import { InputWithLabel } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { TextareaWithLabel } from '@/components/ui/TextareaWithLabel';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useAddDeliveryAddressMutation } from './DeliveryAddressAdd.mutation.generated';
import { InputAddressesInitializePartsFragment } from './DeliveryAddressAdd.fragment.generated';

type Props = {
  fragment: InputAddressesInitializePartsFragment;
  onSubmit: () => void;
};

type FormState = {
  prefecture: string;
  address1: string;
  address2: string;
  deliveryNote: string;
};

const init = ({ prefecture, addressLine }: InputAddressesInitializePartsFragment): FormState => ({
  prefecture: prefecture,
  address1: addressLine,
  address2: '',
  deliveryNote: '',
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

export const InputAddresses: FC<Props> = ({ fragment, onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, fragment, init);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [result, addDeliveryAddress] = useAddDeliveryAddressMutation();
  useLoadingOverlay(result.fetching);

  const isValid = useMemo(() => {
    return state.prefecture !== '' && state.address1 !== '';
  }, [state.address1, state.prefecture]);

  const handleChangeAddress1 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setAddress1', payload: e.target.value });
  }, []);

  const handleChangeAddress2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setAddress2', payload: e.target.value });
  }, []);

  const handleChangeDeliveryNote = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'setDeliveryNote', payload: e.target.value });
  }, []);

  const handleClickRegister = useCallback(async () => {
    const { prefecture, address1, address2, deliveryNote } = state;
    if (!isValid) {
      return;
    }
    const { error } = await addDeliveryAddress({
      input: {
        prefecture,
        addressLine: address1,
        buildingName: address2,
        memo: deliveryNote,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    onSubmit();
  }, [state, isValid, addDeliveryAddress, onSubmit, handleErrorWithAlertDialog]);

  return (
    <>
      <VStack mt="24px" spacing="24px">
        <InputWithLabel w="full" id="prefecture" label="都道府県" value={state.prefecture} disabled />
        <InputWithLabel
          w="full"
          id="address1"
          label="市区町村、番地"
          placeholder="渋谷区円山町28-1"
          value={state.address1}
          onChange={handleChangeAddress1}
        />
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
    </>
  );
};
