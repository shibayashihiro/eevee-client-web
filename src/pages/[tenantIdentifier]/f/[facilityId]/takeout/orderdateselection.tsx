import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { genOrderDateSelectionPage } from '@/components/page/weborder/OrderDateSelection';
import { OrderType } from '@/graphql/generated/types';

const page = genOrderDateSelectionPage(OrderType.Takeout);
page.getLayout = WebOrderLayout;

export default page;
