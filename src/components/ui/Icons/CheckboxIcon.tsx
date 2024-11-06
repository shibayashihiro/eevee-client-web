import { Icon } from '@chakra-ui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export const CheckboxIcon = ({ checked, disabled }: { checked: boolean; disabled: boolean }) => {
  if (checked) {
    return (
      <Icon
        as={CheckCircleIcon}
        boxSize="24px"
        color="brand.primary"
        _hover={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
    );
  }
  return <Icon as={RadioButtonUncheckedIcon} color="mono.divider" boxSize="24px" opacity={disabled ? 0.4 : 1.0} />;
};
