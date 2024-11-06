import { VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { resolvePrice } from '@/utils/domain/courseMenu';
import { courseMenuAsMenuItemDetailPage } from '@/utils/paths/facilityPages';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { MenuCategoryCarousel } from '../MenuCategoryCarousel';

import { HomeCourseMenuCategoriesSectionFragment } from './HomeCourseMenuCategoriesSection.fragment.generated';

type Props = {
  courseMenuCategoriesSection: HomeCourseMenuCategoriesSectionFragment;
};

export const HomeCourseMenuCategoriesSection = ({ courseMenuCategoriesSection }: Props) => {
  const facilityId = useFacilityId();
  const { showPriceExcludingTax } = useFeatureFlags();
  return (
    <VStack align="stretch" spacing="32px">
      {courseMenuCategoriesSection.categories.map((category) => (
        <MenuCategoryCarousel key={category.id} categoryName={category.name} paddingX={containerMarginX}>
          {category.courses.map((course) => {
            const { price, priceExcludingTax } = resolvePrice(course.pricePerPerson);
            return (
              <MenuCategoryCarousel.Item
                key={course.id}
                pathToDetail={courseMenuAsMenuItemDetailPage(facilityId, course.id)}
                image={null} // TODO: implement
                name={course.name}
                price={price}
                priceExcludingTax={showPriceExcludingTax ? priceExcludingTax : undefined}
                priceIsRange={course.pricePerPerson?.__typename === 'CourseMenuRangePricePerPerson'}
              />
            );
          })}
        </MenuCategoryCarousel>
      ))}
    </VStack>
  );
};
