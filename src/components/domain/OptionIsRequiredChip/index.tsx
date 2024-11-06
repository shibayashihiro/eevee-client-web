import { IsRequiredChip } from '@/components/ui/IsRequiredChip';

import { OptionIsRequiredChipPartsFragment } from './OptionIsRequiredChip.fragment.generated';

type Props = {
  option: OptionIsRequiredChipPartsFragment;
};

const makeLabel = (option: OptionIsRequiredChipPartsFragment): string => {
  const { minSelectCount, maxSelectCount, maxSelectCountPerItem } = option;
  const isRequired = !!minSelectCount && minSelectCount > 0;

  let title = '';
  if (!isRequired) {
    title = `任意・${maxSelectCount}点まで選択できます`;
  } else if (minSelectCount === maxSelectCount) {
    title = `必須・${minSelectCount}点選択してください`;
  } else {
    title = `必須・${maxSelectCount}点まで選択してください`;
  }

  if (maxSelectCountPerItem && maxSelectCountPerItem > 0) {
    title += `(各${maxSelectCountPerItem}点まで)`;
  }
  return title;
};

export const OptionIsRequiredChip = ({ option }: Props) => {
  const { minSelectCount } = option;
  const isRequired = !!minSelectCount && minSelectCount > 0;

  return <IsRequiredChip label={makeLabel(option)} variant={isRequired ? 'required' : 'optional'} />;
};
