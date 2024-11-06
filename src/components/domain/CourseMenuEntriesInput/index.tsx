import { VStack, Text, Heading } from '@chakra-ui/react';

import { InputErrorMessage } from '@/components/ui/InputErrorMessage';
import { useCourseMenuEntriesForm } from '@/providers/CourseMenuEntriesFormProvider';

import { CourseMenuEntriesInputFragment } from './CourseMenuEntriesInput.fragment.generated';
import { InputCourseMenuEntry } from './InputPeopleCountListItem';

type Props = {
  courseMenu: CourseMenuEntriesInputFragment;
  // 見出しテキスト
  heading: string;
  description?: string;
};

export const CourseMenuEntriesInput = ({ heading, courseMenu, description }: Props) => {
  const state = useCourseMenuEntriesForm();

  const { minSelectCount } = courseMenu;
  const error = state.errorByCourseMenuId[courseMenu.id];
  return (
    <VStack align="stretch" spacing="12px">
      <VStack align="start" spacing="4px">
        <Heading as="h3" className="bold-large mono.primary" fontSize="18px">
          {heading}
        </Heading>
        {description && <Text className="text-normal">{description}</Text>}
        {minSelectCount > 0 ? <RequiredText minSelectCount={minSelectCount} /> : <OptionalSelectText />}
        {error && <InputErrorMessage message={error} />}
      </VStack>
      <VStack align="stretch" spacing="12px">
        {courseMenu.entries.map((entry) => (
          <InputCourseMenuEntry key={entry.id} courseMenuId={courseMenu.id} entry={entry} />
        ))}
      </VStack>
    </VStack>
  );
};

const RequiredText = ({ minSelectCount }: { minSelectCount: number }) => {
  return (
    <Text className="bold-small" color="brand.primaryText">
      {`必須・${minSelectCount}人以上選択してください`}
    </Text>
  );
};

const OptionalSelectText = () => {
  return (
    <Text className="text-small" color="mono.secondary">
      任意
    </Text>
  );
};
