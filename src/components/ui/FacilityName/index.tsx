import { HStack, Icon, Text } from '@chakra-ui/react';
import { Store } from '@mui/icons-material';

export const FacilityName = ({ facilityName }: { facilityName: string }) => {
  return (
    <HStack>
      <Icon as={Store} boxSize="18px" />
      <Text ml="7px" className="bold-large">
        {facilityName}
      </Text>
    </HStack>
  );
};
