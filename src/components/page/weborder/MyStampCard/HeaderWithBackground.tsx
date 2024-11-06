import { Text, Center } from '@chakra-ui/react';

type Props = {
  title: string;
};
export const HeaderWithBackground = ({ title }: Props) => {
  if (!title) {
    title = 'スタンプカード';
  }
  return (
    <Center as="header" py="24px" bg="brand.backgroundSoft" borderBottom="0.5px" borderColor="mono.divider">
      <Text
        px="20px"
        py="8px"
        bgColor="brand.primary"
        color="mono.white"
        borderRadius="90px"
        gap="10px"
        className="bold-medium"
      >
        {title}
      </Text>
    </Center>
  );
};
