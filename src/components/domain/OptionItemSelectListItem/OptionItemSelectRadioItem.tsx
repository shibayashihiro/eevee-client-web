import { CheckboxIcon } from '@/components/ui/Icons/CheckboxIcon';

import { OptionItemSelectListItem } from './OptionItemSelectListItem';
import { OptionItemSelectListItemPartsFragment } from './OptionItemSelectListItem.fragment.generated';
import { ShowNextIcon } from './ShowNextIcon';
type Props = {
  item: OptionItemSelectListItemPartsFragment;
  checked: boolean;
  showImage: boolean;
  showNext?: boolean;
  onClick: () => void;
};

export const OptionItemSelectRadioItem = ({ item, showImage, checked, showNext, onClick }: Props) => {
  return (
    <OptionItemSelectListItem
      item={item}
      action={checked || !showNext ? <CheckboxIcon checked={checked} disabled={!item.status.available} /> : null}
      showImage={showImage}
      rightElement={showNext && !checked && <ShowNextIcon />}
      onClickRow={onClick}
    />
  );
};
