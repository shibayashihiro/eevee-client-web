import React, { ComponentProps, FC } from 'react';
import { Center, Text } from '@chakra-ui/react';

type Props = Pick<
  ComponentProps<typeof Center>,
  'w' | 'width' | 'h' | 'height' | 'boxSize' | 'rounded' | 'borderRadius'
>;

export const NoImage: FC<Props> = (props: Props) => (
  <Center background="#EFEFEF" {...props}>
    <Text className="mono-hint bold-extra-small">No Image</Text>
  </Center>
);
