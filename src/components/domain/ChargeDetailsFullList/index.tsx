import { Text, HStack, List, ListItem } from '@chakra-ui/react';

import { formatPrice } from '@/utils/formatUtils';

import { ChargeDetailsFullListPartsFragment } from './ChargeDetailsFullList.fragment.generated';

type Props = {
  charge: ChargeDetailsFullListPartsFragment;
};

export const ChargeDetailsFullList = ({ charge }: Props) => {
  return (
    <List spacing="8px" w="full">
      {charge.details.map((details, index) => (
        <ChargeDetailsListItem key={index} name={details.name} amount={details.amount} />
      ))}
      <ListItem>
        <TotalAmount amount={charge.amount} />
      </ListItem>
    </List>
  );
};

const ChargeDetailsListItem = ({ name, amount }: { name: string; amount: number }) => {
  return (
    <ListItem>
      <HStack spacing="8px" justifyContent="space-between">
        <Text>{name}</Text>
        <Text>{formatPrice(amount)}</Text>
      </HStack>
    </ListItem>
  );
};

const TotalAmount = ({ amount }: { amount: number }) => {
  return (
    <HStack spacing="8px" justifyContent="space-between" className="bold-medium">
      <Text>合計</Text>
      <Text>{formatPrice(amount)}</Text>
    </HStack>
  );
};
