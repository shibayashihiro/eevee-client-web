import { productionApps } from './data/production';
import { stagingApps } from './data/staging';

export * from './types';

const getApps = () => {
  // 本当は公開されている環境変数ではなく、静的にビルド時に切り替えたいが、getStaticPathsやgetStaticPropsを
  // いろんなページ横断で使うことが難しいため、環境変数で切り替えている。
  // NOTE: App Router に移行できると、Layoutシステムを使うことで、やりたいことを実現できそう。
  if (process.env.NEXT_PUBLIC_ENV == 'production') {
    return productionApps;
  }
  return stagingApps;
};

export const apps = getApps();
