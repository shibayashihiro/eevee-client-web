import React, { FC, useState } from 'react';
import { Box, OrderedList, Text, VStack } from '@chakra-ui/react';

import { CounterButton } from '@/components/domain/CustomerAttributeSelect/CounterButton';
import { containerMarginX } from '@/utils/constants';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useGetCustomerAttributesQuery } from '@/components/domain/CustomerAttributeSelect/CustomerAttributeSelect.query.generated';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

type Props = {
  onSubmit: (customerAttributes: Map<string, number>) => void;
};

export const CustomerAttributeSelect: FC<Props> = ({ onSubmit }: Props) => {
  const [selecting, setSelecting] = useState<Map<string, number>>(new Map());

  const facilityId = useFacilityId();

  const [result] = useGetCustomerAttributesQuery({
    variables: {
      facilityID: facilityId,
    },
  });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  const isSelected = (value: Map<string, number>) => {
    let sum = 0;
    value.forEach((v) => {
      sum += v;
    });
    return sum > 0;
  };
  const selected = isSelected(selecting);

  const label = (minSelectCount: number) => {
    const isRequired = minSelectCount > 0;
    if (isRequired) {
      return `必須・${minSelectCount}点以上選択してください`;
    }
    return `任意`;
  };
  const onChange = (id: string, value: number) => {
    const newSelecting = new Map(selecting);
    newSelecting.set(id, value);
    setSelecting(newSelecting);
  };

  const onClick = () => {
    onSubmit(selecting);
  };

  return (
    <>
      <VStack mx={containerMarginX} mt="36px" alignItems="start">
        <Text className="bold-large">ご来店ありがとうございます</Text>
        <Text className="text-large" mt="32px">
          来店人数の選択をお願いいたします
        </Text>
        <OrderedList w="full" mt="24px" ml={0}>
          {data?.customerAttributes.map((customerAttribute) => (
            <Box key={customerAttribute.name}>
              <Text className="bold-small">{customerAttribute.name}</Text>
              <Text className="bold-micro" color="brand.primaryText">
                {label(customerAttribute.minSelectCount)}
              </Text>
              <VStack>
                {customerAttribute.details.map((detail) => (
                  <CounterButton
                    detail={detail}
                    value={selecting.get(detail.id) ?? 0}
                    onChange={onChange}
                    key={detail.id}
                  />
                ))}
              </VStack>
            </Box>
          ))}
        </OrderedList>
        <Box
          w="full"
          position="fixed"
          bottom={0}
          left={0}
          py="22px"
          borderTopColor="mono.divider"
          borderTopStyle="solid"
          borderTopWidth="0.5px"
        >
          <Box px={containerMarginX}>
            {selected ? (
              <PrimaryButton h="56px" rounded="32px" onClick={onClick}>
                注文をはじめる
              </PrimaryButton>
            ) : (
              <SecondaryButton h="56px" rounded="32px" color="mono.white" bg="mono.hint">
                注文をはじめる
              </SecondaryButton>
            )}
          </Box>
        </Box>
      </VStack>
    </>
  );
};
