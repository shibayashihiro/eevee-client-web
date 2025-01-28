import { useState, useCallback, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { resolvePrice } from '@/utils/domain/courseMenu';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';
import { CourseMenuDetailModalContent } from '@/components/domain/CourseMenuDetailModalContent';

import { MenuCategoryCarousel } from '../MenuCategoryCarousel';

import { HomeCourseMenuCategoriesSectionFragment } from './HomeCourseMenuCategoriesSection.fragment.generated';

type Props = {
  courseMenuCategoriesSection: HomeCourseMenuCategoriesSectionFragment;
};
export type course = HomeCourseMenuCategoriesSectionFragment['categories'][0]['courses'][0];

export const HomeCourseMenuCategoriesSection = ({ courseMenuCategoriesSection }: Props) => {
  const [selectedItem, setSelectedItem] = useState<course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((course: course) => {
    setSelectedItem(course);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // クリーンアップ
    };
  }, [isModalOpen]);
  const { showPriceExcludingTax } = useFeatureFlags();
  return (
    <>
      <VStack align="stretch" spacing="32px">
        {courseMenuCategoriesSection.categories.map((category) => (
          <MenuCategoryCarousel key={category.id} categoryName={category.name} paddingX={containerMarginX}>
            {category.courses.map((course) => {
              const { price, priceExcludingTax } = resolvePrice(course.pricePerPerson);
              return (
                <MenuCategoryCarousel.Item
                  key={course.id}
                  onClick={() => openModal(course)}
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
      <SwipeableBottomModal
        isOpen={isModalOpen && !!selectedItem?.id}
        onClose={closeModal}
        title={selectedItem?.name || ''}
        footer={null}
      >
        {selectedItem?.id && <CourseMenuDetailModalContent courseMenuId={selectedItem.id} closeModal={closeModal} />}
      </SwipeableBottomModal>
    </>
  );
};
