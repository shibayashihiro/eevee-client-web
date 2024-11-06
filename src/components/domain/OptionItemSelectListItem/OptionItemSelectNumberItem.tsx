import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { HStack, Icon, Text } from '@chakra-ui/react';

import { OptionItemSelectListItem } from './OptionItemSelectListItem';
import { OptionItemSelectListItemPartsFragment } from './OptionItemSelectListItem.fragment.generated';
import { ShowNextIcon } from './ShowNextIcon';

type Props = {
  item: OptionItemSelectListItemPartsFragment;
  value: number;
  disabled: boolean;
  showImage: boolean;
  showNext?: boolean;
  onClickDecrement: () => void;
  onClickIncrement: () => void;
  onClickNext?: () => void;
};

export const OptionItemSelectNumberItem = ({
  item,
  showImage,
  value,
  disabled,
  showNext,
  onClickDecrement,
  onClickIncrement,
  onClickNext,
}: Props) => {
  const selected = value > 0;
  return (
    <OptionItemSelectListItem
      item={item}
      action={
        <HStack>
          {selected && (
            <>
              <Icon as={RemoveCircleOutlineIcon} boxSize="24px" color="brand.primary" onClick={onClickDecrement} />
              <Text className="text-medium" color="brand.primaryText">
                {value}
              </Text>
            </>
          )}
          <Icon
            as={AddCircleOutlineIcon}
            boxSize="24px"
            color="brand.primary"
            opacity={!disabled ? 1 : 0.4}
            onClick={onClickIncrement}
          />
        </HStack>
      }
      showImage={showImage}
      rightElement={showNext && !selected && <ShowNextIcon onClick={onClickNext} />}
    />
  );
};
