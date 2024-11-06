import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { getStaticPaths, getStaticProps, PrivacyPage } from '@/components/page/weborder/Privacy/index';
export { getStaticPaths, getStaticProps };

PrivacyPage.getLayout = WebOrderLayout;

export default PrivacyPage;
