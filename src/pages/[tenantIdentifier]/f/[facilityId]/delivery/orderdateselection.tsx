import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { genOrderDateSelectionPage as orderDateSelectionPage } from '@/components/page/weborder/OrderDateSelection';
import { OrderType } from '@/graphql/generated/types';

const page = orderDateSelectionPage(OrderType.Delivery);
page.getLayout = WebOrderLayout;

export default page;
