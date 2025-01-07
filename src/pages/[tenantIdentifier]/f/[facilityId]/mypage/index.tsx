// NOTE:
// マイページ機能自体はテナント単位に存在してもよいが、
// スタンプカード機能が有効かどうかはFacilityに依存するため、FacilityId以下のパスにしている。

import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { FacilityMyPage } from '@/components/page/weborder/MyPage';

FacilityMyPage.getLayout = WebOrderLayout;

export default FacilityMyPage;
