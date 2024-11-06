/**
 * URLはユーザーから見えるため、わかりやすく /menus にしているが、
 * Chompyでいうところの CourseMenu に関連するページ。
 */

import { StartCourseMenuLayout } from '@/components/layouts/StartCourseMenuLayout';
import { CourseMenusPage } from '@/components/page/weborder/CourseMenus';

CourseMenusPage.getLayout = StartCourseMenuLayout;

export default CourseMenusPage;
