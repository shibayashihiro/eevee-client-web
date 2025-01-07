import { Text } from '@chakra-ui/react';
type Props = {
  quantity: number;
};

export const OrderItemQuantity = ({ quantity }: Props) => {
  return (
    <Text
      boxSizing="border-box"
      minH="24px"
      minW="24px"
      px="4px"
      borderRadius="4px"
      border="2px"
      borderColor="mono.primary"
      aria-label={`商品の数量: ${quantity}点`}
      align="center"
    >
      <Text as="span" fontSize="small" fontWeight="700" lineHeight="21px" letterSpacing="-0.16px" aria-hidden="true">
        {quantity}
      </Text>
    </Text>
  );
};
