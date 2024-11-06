// NOTE:
// スタンプカード機能自体はテナント単位に存在するものだが、
// スタンプカード機能が有効かどうかはFacilityに依存するため、FacilityId以下のパスにしている。

import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { MyStampCardPage } from '@/components/page/weborder/MyStampCard';

MyStampCardPage.getLayout = WebOrderLayout;

export default MyStampCardPage;
