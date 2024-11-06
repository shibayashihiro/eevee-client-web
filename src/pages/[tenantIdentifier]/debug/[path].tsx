import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import { NextPageWithLayout } from '@/types';
import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { apps } from '@/apps';
import { useAuth } from '@/auth/provider/AuthProvider';

type Props = {
  debugEnabled: boolean;
};

export const getStaticPaths = (() => {
  const paths = apps.identifiers.map((identifier) => ({ params: { tenantIdentifier: identifier, path: 'info' } }));
  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (({}) => {
  return {
    props: {
      debugEnabled: process.env.APP_ENV !== 'production',
    },
  };
}) satisfies GetStaticProps<Props>;

const DebugPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({ debugEnabled }) => {
  const { getCurrentUser } = useAuth();

  if (!debugEnabled) {
    throw new Error('page not found');
  }

  const user = getCurrentUser();
  const userId = user?.uid;

  const handleClickCopy = async () => {
    if (!userId) {
      return;
    }
    await navigator.clipboard.writeText(userId);
    window.alert('クリップボードにコピーしました');
  };

  return (
    <div>
      <p>user id: {userId}</p>
      <button onClick={handleClickCopy}>copy(タップしてください)</button>
    </div>
  );
};

DebugPage.getLayout = WebOrderLayout;

export default DebugPage;
