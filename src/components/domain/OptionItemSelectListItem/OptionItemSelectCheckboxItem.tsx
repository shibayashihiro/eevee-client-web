import { Checkbox } from '@chakra-ui/react';

import { OptionItemSelectListItem } from './OptionItemSelectListItem';
import { OptionItemSelectListItemPartsFragment } from './OptionItemSelectListItem.fragment.generated';
import { ShowNextIcon } from './ShowNextIcon';
type Props = {
  item: OptionItemSelectListItemPartsFragment;
  disabled: boolean;
  checked: boolean;
  showImage: boolean;
  showNext?: boolean;
  onClick: () => void;
};

export const OptionItemSelectCheckboxItem = ({ item, disabled, showImage, checked, showNext, onClick }: Props) => {
  return (
    <OptionItemSelectListItem
      item={item}
      action={<Checkbox disabled={disabled} colorScheme="brand" size="lg" isChecked={checked} />}
      showImage={showImage}
      rightElement={showNext && !checked && <ShowNextIcon />}
      onClickRow={onClick}
      disabled={disabled}
    />
  );
};
