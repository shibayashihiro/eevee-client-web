import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { HStack, VStack, Text, Box, Divider, Icon, IconButton } from '@chakra-ui/react';

import { useCourseMenuEntriesForm, useCourseMenuEntriesFormDispatch } from '@/providers/CourseMenuEntriesFormProvider';
import { InputErrorMessage } from '@/components/ui/InputErrorMessage';
import { IsRequiredChip } from '@/components/ui/IsRequiredChip';
import { formatOptionItemPrice } from '@/utils/domain/menuItemOption';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragment } from './CourseMenuEntriesInput.fragment.generated';

type Props = {
  courseMenu: CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragment;
};

export const CourseMenuEntriesInput = ({ courseMenu }: Props) => {
  const state = useCourseMenuEntriesForm();

  const { id: courseMenuId, minSelectCount, entries } = courseMenu;
  const error = state.errorByCourseMenuId[courseMenuId];

  return (
    <VStack align="stretch" spacing="8px">
      <VStack align="start" spacing="6px">
        <HStack spacing="6px" alignItems="center">
          <Text className="bold-small">ご利用人数</Text>
          {minSelectCount > 0 ? (
            <IsRequiredChip label={`必須・${minSelectCount}人以上選択してください`} variant="required" />
          ) : (
            <IsRequiredChip label="任意" variant="optional" />
          )}
        </HStack>
        {error && <InputErrorMessage message={error} />}
      </VStack>
      <Box>
        <Divider mt="8px" />
        <VStack align="stretch" spacing={0} divider={<Divider as="div" />}>
          {entries.map((entry) => (
            <InputCourseMenuEntry key={entry.id} courseMenuId={courseMenuId} entry={entry} />
          ))}
        </VStack>
        <Divider mt="8px" />
      </Box>
    </VStack>
  );
};

const InputCourseMenuEntry = ({
  courseMenuId,
  entry,
}: {
  courseMenuId: string;
  entry: CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragment['entries'][0];
}) => {
  const { quantityById } = useCourseMenuEntriesForm();
  const { setQuantity } = useCourseMenuEntriesFormDispatch();
  const { name } = entry;

  const currentQuantity = quantityById[courseMenuId]?.[entry.id] ?? 0;

  const onClickRemove = () => {
    if (currentQuantity === 0) {
      return;
    }
    setQuantity(courseMenuId, entry.id, currentQuantity - 1);
  };

  const onClickAdd = () => {
    setQuantity(courseMenuId, entry.id, currentQuantity + 1);
  };

  return (
    <HStack color="mono.primary" w="full" minH="56px" justify="space-between">
      <VStack alignItems="start" spacing="3px">
        <Text className="text-medium">{name}</Text>
        <PriceText entry={entry} />
      </VStack>
      <HStack spacing={0}>
        {currentQuantity > 0 && (
          <>
            <IconButton
              variant="ghost"
              icon={<Icon as={RemoveCircleOutlineIcon} boxSize="24px" />}
              aria-label="人数を減らす"
              color="brand.primary"
              onClick={onClickRemove}
              _hover={{ bgColor: 'inherit' }}
              _active={{ bgColor: 'inherit' }}
            />
            <Text className="text-medium" color="brand.primaryText" align="center" minW="32px">
              {currentQuantity}
            </Text>
          </>
        )}
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
    </HStack>
  );
};

const PriceText = ({ entry }: { entry: CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragment['entries'][0] }) => {
  const { showPriceExcludingTax } = useFeatureFlags();
  if (!entry.price || !entry.priceExcludingTax) {
    return null;
  }

  return (
    <HStack alignItems="center" spacing={1}>
      <Text className="bold-small">
        {formatOptionItemPrice(showPriceExcludingTax ? entry.priceExcludingTax : entry.price)}
      </Text>
      {showPriceExcludingTax && <Text className="text-micro">{`(税込${formatOptionItemPrice(entry.price)})`}</Text>}
    </HStack>
  );
};
