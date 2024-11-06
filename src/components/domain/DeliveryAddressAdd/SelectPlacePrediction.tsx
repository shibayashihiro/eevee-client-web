import { FC, useCallback, useState } from 'react';
import { StackDivider, VStack, Text, Spacer } from '@chakra-ui/react';

import { InputSearch } from '@/components/ui/Input/InputSearch';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useGetPlacePredictionsQuery } from './DeliveryAddressAdd.query.generated';

type Props = {
  onClickPlacePrediction: (place: string) => void;
};

export const SelectPlacePrediction: FC<Props> = ({ onClickPlacePrediction }) => {
  const [placeKeyword, setPlaceKeyword] = useState('');

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useGetPlacePredictionsQuery({
    variables: {
      keyword: placeKeyword,
    },
    pause: !placeKeyword,
  });

  const { data, error } = result;
  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlaceKeyword(e.target.value);
    },
    [setPlaceKeyword],
  );

  const geneHandleClickPlacePrediction: (place: string) => () => void = useCallback(
    (place: string) => () => {
      onClickPlacePrediction(place);
    },
    [onClickPlacePrediction],
  );

  return (
    <VStack spacing="24px">
      <InputSearch placeholder="住所・ビル名・地名を入力" h="56px" onChange={handleChangeInput} />
      <VStack w="full" divider={<StackDivider color="mono.divider" />}>
        {placeKeyword !== '' &&
          data?.placePredictions?.map((place, i) => (
            <VStack
              key={i}
              w="full"
              py="12px"
              align="start"
              spacing="4px"
              _hover={{
                cursor: 'pointer',
              }}
              onClick={geneHandleClickPlacePrediction(place.placeId)}
            >
              <Text className="bold-medium" lineHeight="22px">
                {place.mainText}
              </Text>
              <Text className="text-extra-small" color="mono.secondary">
                {place.secondaryText}
              </Text>
            </VStack>
          ))}
        <Spacer />
      </VStack>
    </VStack>
  );
};
