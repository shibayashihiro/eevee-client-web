import { ComponentProps, FC } from 'react';
import { Icon, InputGroup, InputLeftElement } from '@chakra-ui/react';
import SearchIcon from '@mui/icons-material/Search';

import { BasicInput } from './BasicInput';

type Props = ComponentProps<typeof BasicInput>;

export const InputSearch: FC<Props> = (props) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" h="full" ml="11px">
        <Icon as={SearchIcon} boxSize="24px" />
      </InputLeftElement>
      <BasicInput type="text" {...props} pl="48px" />
    </InputGroup>
  );
};
