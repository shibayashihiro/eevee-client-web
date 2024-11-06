import { VStack, Text, Box, Heading, LinkOverlay, LinkBox } from '@chakra-ui/react';

import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { formatPrice } from '@/utils/formatUtils';
import { NextLink } from '@/components/ui/NextLink';
import { courseMenuPage } from '@/utils/paths/facilityPages';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useCourseMenusCartDispatch } from '@/providers/CourseMenusCartProvider';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';
import { resolvePrice } from '@/utils/domain/courseMenu';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import {
  CourseMenuCategoryListItemFragment,
  CourseMenuListItemFragment,
} from './CourseMenuCategoryListItem.fragment.generated';

type Props = {
  category: CourseMenuCategoryListItemFragment;
};

export const CourseMenuCategoryListItem = ({ category }: Props) => {
  return (
    <VStack align="stretch" spacing="16px">
      <Text className="bold-large">{category.name}</Text>
      {category.description && (
        <Text className="text-normal" whiteSpace="pre-line">
          {category.description}
        </Text>
      )}
      <VStack align="stretch" spacing="16px">
        {category.courses.map((menu) => (
          <CourseMenuListItem key={menu.id} categoryName={category.name} menu={menu} />
        ))}
      </VStack>
    </VStack>
  );
};

const CourseMenuListItem = ({ categoryName, menu }: { categoryName: string; menu: CourseMenuListItemFragment }) => {
  return (
    <LinkBox
      as="article"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      p="12px 12px 12px 16px"
      borderRadius="4px"
      border="1px solid"
      borderColor="mono.divider"
    >
      <CourseMenuDetails categoryName={categoryName} menu={menu} />
      <RightIcon color="brand.primary" boxSize="24px" />
    </LinkBox>
  );
};

const CourseMenuDetails = ({ categoryName, menu }: { categoryName: string; menu: CourseMenuListItemFragment }) => {
  const facilityId = useFacilityId();
  const tableId = useTableIdFromQuery();
  const dispatch = useCourseMenusCartDispatch();

  const onClickLink = () => {
    /**
     * 暗黙の概念としてコース一覧に表示するものを「コース」としている。（その後サジェストされるコースは、アップセル的な意味合い。）
     * この「コース」は1つの卓で1つまでしか注文できないため、「コース」を選択した際にカートをクリアしている。(Providerの実装を参照)
     */
    dispatch({
      type: 'START_COURSE_MENU_SELECT',
      rule: {
        title: categoryName,
        descriptions: menu.ruleDescriptions,
      },
    });
  };

  return (
    <Box>
      <LinkOverlay as={NextLink} href={courseMenuPage(facilityId, tableId, menu.id)} onClick={onClickLink}>
        <Heading as="h3" className="bold-extra-large" fontSize="20px" mb="2px">
          {menu.name}
        </Heading>
      </LinkOverlay>
      <PriceText menu={menu} />
      {menu.description && <Text className="text-small">{menu.description}</Text>}
    </Box>
  );
};

const PriceText = ({ menu }: { menu: CourseMenuListItemFragment }) => {
  const { showPriceExcludingTax } = useFeatureFlags();

  if (!menu.pricePerPerson) {
    return null;
  }

  const { price, priceExcludingTax } = resolvePrice(menu.pricePerPerson);
  const showRange = menu.pricePerPerson?.__typename === 'CourseMenuRangePricePerPerson';
  const priceSuffix = showRange ? '〜' : '';

  if (showPriceExcludingTax) {
    return (
      <Text className="bold-small" mb="4px">
        お一人様 {formatPrice(priceExcludingTax)}
        <Text as="span" className="text-micro" fontWeight="normal">
          &nbsp;(税込{formatPrice(price)})
        </Text>
        {priceSuffix}
      </Text>
    );
  }
  return (
    <Text className="bold-small" mb="4px">
      {`お一人様 ${formatPrice(price)}${priceSuffix}`}
    </Text>
  );
};
