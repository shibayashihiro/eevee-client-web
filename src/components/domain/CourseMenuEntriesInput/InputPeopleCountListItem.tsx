import { HStack, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { formatPrice } from '@/utils/formatUtils';
import { useCourseMenuEntriesForm, useCourseMenuEntriesFormDispatch } from '@/providers/CourseMenuEntriesFormProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { CourseMenuEntryForInputPeopleCountListItemFragment } from './InputPeopleCountListItem.fragment.generated';

type Props = {
  courseMenuId: string;
  entry: CourseMenuEntryForInputPeopleCountListItemFragment;
};

export const InputCourseMenuEntry = ({ courseMenuId, entry }: Props) => {
  return (
    <HStack justify="space-between" p="8px" border="1px solid" borderColor="mono.divider" borderRadius="4px">
      <Labels entry={entry} />
      <CounterButtons courseMenuId={courseMenuId} entryId={entry.id} />
    </HStack>
  );
};

const Labels = ({
  entry: { name, price, priceExcludingTax },
}: {
  entry: CourseMenuEntryForInputPeopleCountListItemFragment;
}) => {
  const { showPriceExcludingTax } = useFeatureFlags();
  const hasPrice = price > 0;
  const usePriceExcludingTax = showPriceExcludingTax && priceExcludingTax;
  return (
    <VStack align="start" spacing="2px">
      <Text className="bold-normal">{name}</Text>
      {hasPrice && (
        <HStack align="start" alignItems="center">
          <Text className="text-normal">{formatPrice(usePriceExcludingTax ? priceExcludingTax : price)}</Text>
          {usePriceExcludingTax && <Text className="text-micro">(税込{formatPrice(price)})</Text>}
        </HStack>
      )}
    </VStack>
  );
};

const CounterButtons = ({ courseMenuId, entryId }: { courseMenuId: string; entryId: string }) => {
  const { quantityById } = useCourseMenuEntriesForm();
  const { setQuantity } = useCourseMenuEntriesFormDispatch();

  const currentQuantity = quantityById[courseMenuId]?.[entryId] ?? 0;

  const onClickRemove = () => {
    if (currentQuantity === 0) {
      return;
    }
    setQuantity(courseMenuId, entryId, currentQuantity - 1);
  };
  const onClickAdd = () => {
    setQuantity(courseMenuId, entryId, currentQuantity + 1);
  };
  return (
    <HStack spacing={0} alignItems="center">
      <IconButton
        variant="ghost"
        icon={<Icon as={RemoveCircleOutlineIcon} boxSize="24px" />}
        aria-label="人数を減らす"
        color={currentQuantity === 0 ? 'mono.hint' : 'brand.primary'}
        onClick={onClickRemove}
        _hover={{ bgColor: 'inherit' }}
        _active={{ bgColor: 'inherit' }}
      />
      <Text className="bold-large" color="brand.primaryText" textAlign="center" w="40px" h="24px" lineHeight="24px">
        {currentQuantity}
      </Text>
      <IconButton
        variant="ghost"
        icon={<Icon as={AddCircleOutlineIcon} boxSize="24px" />}
        aria-label="人数を増やす"
        color="brand.primary"
        onClick={onClickAdd}
        _hover={{ bgColor: 'inherit' }}
        _active={{ bgColor: 'inherit' }}
      />
    </HStack>
  );
};
