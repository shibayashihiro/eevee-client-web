import { HStack, Spacer, Image, VStack, Text } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { formatOptionItemPrice } from '@/utils/domain/menuItemOption';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { NoImage } from '../../ui/NoImage';

import { OptionItemSelectListItemPartsFragment } from './OptionItemSelectListItem.fragment.generated';

type Props = {
  item: OptionItemSelectListItemPartsFragment;
  action: React.ReactNode;
  showImage: boolean;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  // 行全体をクリックした時の処理。なければ渡さない
  onClickRow?: () => void;
};

export const OptionItemSelectListItem = ({ item, action, showImage, disabled, rightElement, onClickRow }: Props) => {
  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!onClickRow) {
      return;
    }
    if (!item.status.available || disabled) {
      return;
    }
    onClickRow();
  };

  const boxAdditionalProps: ComponentProps<typeof HStack> = onClickRow
    ? {
        as: 'label', // ここからのハック => https://github.com/chakra-ui/chakra-ui/issues/46
        onClick: handleOnClick,
        _hover: { cursor: item.status.available && !disabled ? 'pointer' : 'not-allowed' },
      }
    : {};
  return (
    <HStack color="mono.primary" w="full" minH="56px" {...boxAdditionalProps}>
      <OptionItemContent item={item} showImage={showImage} />
      <Spacer />
      {item.status.available ? (
        <HStack spacing="16px">
          {action}
          {rightElement && rightElement}
        </HStack>
      ) : (
        <Text className="mono-secondary">{item.status.labelUnavailable}</Text>
      )}
    </HStack>
  );
};

const OptionItemContent = ({
  item,
  showImage,
}: {
  item: OptionItemSelectListItemPartsFragment;
  showImage?: boolean;
}) => {
  const { name, description, image } = item;
  return (
    <HStack spacing="7px">
      {showImage !== undefined && showImage && (
        <Image
          alt={`${name}の画像`}
          src={image ? image : undefined}
          rounded="4px"
          boxSize="80px"
          objectFit="cover"
          fallback={<NoImage rounded="4px" boxSize="80px" />}
        />
      )}
      <VStack alignItems="start" spacing="3px">
        <Text className="text-medium">{name}</Text>
        {description && <Text className="text-small">{description}</Text>}
        <PriceText item={item} />
      </VStack>
    </HStack>
  );
};

const PriceText = ({ item: { price, priceExcludingTax } }: { item: OptionItemSelectListItemPartsFragment }) => {
  const { showPriceExcludingTax } = useFeatureFlags();
  if (!price || !priceExcludingTax) {
    return null;
  }

  return (
    <HStack alignItems="center" spacing={1}>
      <Text className="bold-small">{formatOptionItemPrice(showPriceExcludingTax ? priceExcludingTax : price)}</Text>
      {showPriceExcludingTax && <Text className="text-micro">{`(税込${formatOptionItemPrice(price)})`}</Text>}
    </HStack>
  );
};
