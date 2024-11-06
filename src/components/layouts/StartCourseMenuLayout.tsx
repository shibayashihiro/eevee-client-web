import { CourseMenusCartProvider } from '@/providers/CourseMenusCartProvider';
import { GetLayout } from '@/types';

import { CourseMenuAlreadySelectedGuard } from '../domain/CourseMenuAlreadySelectedGuard';

import { WebOrderLayout } from './WebOrderLayout';

/**
 * メニュー選択から開始する導線画面のレイアウト
 */
export const StartCourseMenuLayout: GetLayout = (page) => {
  return WebOrderLayout(
    <CourseMenusCartProvider>
      <>{page}</>
      <CourseMenuAlreadySelectedGuard />
    </CourseMenusCartProvider>,
  );
};
