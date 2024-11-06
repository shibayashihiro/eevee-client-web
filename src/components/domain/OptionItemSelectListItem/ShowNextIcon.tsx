import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { RightIcon } from '../../ui/Icons/RightIcon';

type Props = ComponentProps<typeof Icon>;

export const ShowNextIcon = (props: Props) => <Icon {...props} as={RightIcon} boxSize="24px" color="mono.secondary" />;
