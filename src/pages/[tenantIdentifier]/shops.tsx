/**
 * 内部的には店舗=Facilityだが、外部に見えるURLはShopとするため shop.tsx にしている
 */
import FacilitiesPage from '@/components/page/weborder/Facilities';
import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';

FacilitiesPage.getLayout = WebOrderLayout;

export default FacilitiesPage;
