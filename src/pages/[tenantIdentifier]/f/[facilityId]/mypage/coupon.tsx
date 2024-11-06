// NOTE:
// クーポン機能自体はテナント単位に存在するものだが、
// スタンプカード機能に合わせるため、FacilityId以下のパスにしている。

import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { MyCouponsPage } from '@/components/page/weborder/MyCoupons';

MyCouponsPage.getLayout = WebOrderLayout;

export default MyCouponsPage;
