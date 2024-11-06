import { FC } from 'react';
import { HStack, Radio, Text } from '@chakra-ui/react';

import { CartDisposableItemPartsFragment } from '@/components/domain/CartDisposableItem/CartDisposableItem.fragment.generated';
import { formatPrice } from '@/utils/formatUtils';

export type Props = {
  item: CartDisposableItemPartsFragment;
  onChange: (id: string) => void;
};

export const CartDisposableItem: FC<Props> = ({ item, onChange }: Props) => {
  return (
    <HStack w="full" justify="space-between">
      <Radio value={item.id} isChecked={item.selected} colorScheme="brand" size="lg" onClick={() => onChange(item.id)}>
        <Text className="bold-small">{item.name}</Text>
      </Radio>
      {item.price > 0 && <Text>+{formatPrice(item.price)}</Text>}
    </HStack>
  );
};
