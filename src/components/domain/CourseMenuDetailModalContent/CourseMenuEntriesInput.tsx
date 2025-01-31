import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { HStack, VStack, Text, Divider, Icon, IconButton, Box } from '@chakra-ui/react';

import { useCourseMenuEntriesForm, useCourseMenuEntriesFormDispatch } from '@/providers/CourseMenuEntriesFormProvider';
import { InputErrorMessage } from '@/components/ui/InputErrorMessage';
import { IsRequiredChip } from '@/components/ui/IsRequiredChip';
import { formatOptionItemPrice } from '@/utils/domain/menuItemOption';
import { containerMarginX } from '@/utils/constants';
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
    <Box w="full" px={containerMarginX} pb="16px" bg={error ? 'mono.errorBackground' : 'transparent'}>
      <VStack align="start" spacing="4px" py="16px">
        <VStack align="start" spacing="4px" position={'sticky'}>
          <Text className="bold-normal">ご利用人数</Text>
          {!error &&
            (minSelectCount > 0 ? (
              <IsRequiredChip label={`必須・${minSelectCount}人以上選択してください`} variant="required" />
            ) : (
              <IsRequiredChip label="任意" variant="optional" />
            ))}
        </VStack>
        {error && <InputErrorMessage message={error} />}
      </VStack>
      <VStack
        spacing={0}
        divider={<Divider as="div" borderColor="mono.divider" />}
        bg="mono.white"
        borderRadius="4px"
        pl="12px"
      >
        {entries.map((entry) => (
          <InputCourseMenuEntry key={entry.id} courseMenuId={courseMenuId} entry={entry} />
        ))}
      </VStack>
    </Box>
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
    <HStack color="mono.primary" w="full" justify="space-between" my="12px" spacing="8px">
      <VStack alignItems="start" spacing="4px">
        <Text className="text-normal">{name}</Text>
        <PriceText entry={entry} />
      </VStack>
      <HStack spacing={0} mr="12px">
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
            <Text className="text-medium" color="brand.primaryText" align="center" minW="16px">
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
    <HStack alignItems="center" spacing="8px">
      <Text className="text-small">
        {formatOptionItemPrice(showPriceExcludingTax ? entry.priceExcludingTax : entry.price)}
      </Text>
      {showPriceExcludingTax && <Text className="text-micro">{`(税込${formatOptionItemPrice(entry.price)})`}</Text>}
    </HStack>
  );
};
