import { FC } from 'react';
import { HStack, Text, Icon, Spacer } from '@chakra-ui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { CustomerAttributeDetail } from '@/graphql/generated/types';

export type Props = {
  detail: CustomerAttributeDetail;
  value: number;
  onChange: (id: string, value: number) => void;
};

export const CounterButton: FC<Props> = ({ detail, value, onChange }: Props) => {
  const onChangeRemove = () => {
    if (value == 0) {
      return;
    }
    onChange(detail.id, value - 1);
  };

  const onChangeAdd = () => {
    onChange(detail.id, value + 1);
  };

  return (
    <HStack
      key={detail.id}
      w="full"
      h="48px"
      p="8px"
      mt="12px"
      borderStyle="solid"
      borderWidth="1px"
      borderColor="mono.divider"
    >
      <Text className="bold-small">{detail.name}</Text>
      <Spacer />
      <HStack>
        <Icon
          as={RemoveCircleOutlineIcon}
          boxSize="24px"
          color={value == 0 ? 'mono.hint' : 'brand.primary'}
          onClick={onChangeRemove}
        ></Icon>
        <Text className="text-medium" color="brand.primaryText">
          {value}
        </Text>
        <Icon as={AddCircleOutlineIcon} boxSize="24px" color="brand.primary" onClick={onChangeAdd}></Icon>
      </HStack>
    </HStack>
  );
};
