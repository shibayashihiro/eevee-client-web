import { FC } from 'react';
import { Text, Box, Divider, UnorderedList, ListItem, HStack, Icon } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import variables from '@/styles/variables.module.scss';
import { CheckIcon } from '@/components/ui/Icons/CheckIcon';

import { useUpdateNoContactDeliveryOptionMutation } from './DeliveryPreferenceDialog.mutation.generated';

interface OptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Option: FC<OptionProps> = ({ label, isSelected, onSelect }) => {
  return (
    <HStack w="full" justifyContent="space-between" onClick={onSelect} cursor="pointer">
      <Text className="bold-small" color={isSelected ? 'brand.primaryText' : ''}>
        {label}
      </Text>
      {isSelected && <Icon as={CheckIcon} color="brand.primaryText" />}
    </HStack>
  );
};

export const NoContactDeliverySelectionDialog: FC<{
  requestNoContactDelivery: boolean;
  isOpen: boolean;
  onClose: () => void;
}> = ({ requestNoContactDelivery, isOpen, onClose }) => {
  const [_, updateNoContactDelivery] = useUpdateNoContactDeliveryOptionMutation();
  const handleOptionSelect = async (selectedValue: boolean) => {
    try {
      await updateNoContactDelivery({ requestNoContactDelivery: selectedValue });
    } catch (error) {
      throw error;
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      secondaryAction={{
        text: '閉じる',
        onClick: onClose,
      }}
      title="置き配"
    >
      <Box mb="16px" w="full">
        <Divider />
        <UnorderedList styleType="none" marginStart="0px">
          <ListItem pt="16px" pb="16px" borderBottom="1px" borderColor={variables.monoBackGround}>
            <Option
              label="希望しない"
              isSelected={!requestNoContactDelivery}
              onSelect={() => handleOptionSelect(false)}
            />
          </ListItem>
          <ListItem pt="16px" pb="16px" borderBottom="1px" borderColor={variables.monoBackGround}>
            <Option label="希望する" isSelected={requestNoContactDelivery} onSelect={() => handleOptionSelect(true)} />
          </ListItem>
        </UnorderedList>
      </Box>
    </ModalDialog>
  );
};
