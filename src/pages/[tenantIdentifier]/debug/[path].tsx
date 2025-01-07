import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import { NextPageWithLayout } from '@/types';
import { WebOrderLayout } from '@/components/layouts/WebOrderLayout';
import { apps } from '@/apps';
import { useAuth } from '@/auth/provider/AuthProvider';

type Props = {
  debugEnabled: boolean;
};

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

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
    <div style={{ padding: '20px' }}>
      <div>
        <p>user id: {userId}</p>
        <button type="button" onClick={handleClickCopy}>
          copy(タップしてください)
        </button>
      </div>
      <div style={{ marginTop: '40px' }}>現在のAPI向き先: {endpoint}</div>
    </div>
  );
};

DebugPage.getLayout = WebOrderLayout;

export default DebugPage;
