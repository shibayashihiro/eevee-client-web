import { FC } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Text, OrderedList, ListItem, HStack, Icon, Divider } from '@chakra-ui/react';

import { ScheduledOrderTimeItemPartsFragment } from '@/components/domain/ScheduledOrderTimeListDialog/ScheduledOrderTimeItemListDialog/ScheduledOrderTimeItemList.fragment.generated';
import { ModalDialog } from '@/components/ui/ModalDialog';
import variables from '@/styles/variables.module.scss';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTap: (minArrival: string, maxArrival: string) => void;
  items: ScheduledOrderTimeItemPartsFragment[];
};

export const ScheduledOrderTimeItemListDialog: FC<Props> = ({ isOpen, onClose, onTap, items }) => {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="日時を選択してください"
      trapFocus={false}
      scrollBehavior={'inside'}
      secondaryAction={{
        text: '閉じる',
        onClick: onClose,
      }}
    >
      <Box mt="8px" mb="16px" w="full">
        <Divider />
        <OrderedList styleType="none" marginStart="0px">
          {items.map((item, i) => (
            <ListItem
              pt="16px"
              pb="16px"
              key={i}
              borderBottom="1px"
              borderColor={variables.monoBackGround}
              onClick={() => onTap(item.minArrival, item.maxArrival)}
            >
              <HStack w="full" justifyContent="space-between">
                <Text className="bold-small" color={item.selected ? 'brand.primaryText' : ''}>
                  {item.name}
                </Text>
                {item.selected && <Icon as={CheckIcon} color="brand.primaryText" />}
              </HStack>
            </ListItem>
          ))}
        </OrderedList>
      </Box>
    </ModalDialog>
  );
};
