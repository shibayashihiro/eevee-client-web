import { FC, useCallback, useState } from 'react';
import { StackDivider, VStack, Text, Spacer } from '@chakra-ui/react';

import { InputSearch } from '@/components/ui/Input/InputSearch';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useGetPlacePredictionsQuery } from './DeliveryAddressAdd.query.generated';

type Props = {
  onClickPlacePrediction: (place: string, keyword: string) => void;
  initialPlaceKeyword?: string;
};

export const SelectPlacePrediction: FC<Props> = ({ onClickPlacePrediction, initialPlaceKeyword = '' }) => {
  const [placeKeyword, setPlaceKeyword] = useState(initialPlaceKeyword);

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

  return (
    <VStack spacing="24px" mt="24px">
      <InputSearch placeholder="住所・ビル名・地名を入力" h="56px" onChange={handleChangeInput} value={placeKeyword} />
      <VStack w="full" spacing="0" divider={<StackDivider color="mono.divider" />}>
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
              onClick={() => onClickPlacePrediction(place.placeId, placeKeyword)}
            >
              <Text className="bold-medium">{place.mainText}</Text>
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
