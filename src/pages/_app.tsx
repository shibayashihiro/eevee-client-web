import { AppPropsWithLayout } from '@/types';

import 'focus-visible/dist/focus-visible';
import '@/styles/globals.scss';

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // 送信しすぎてしまうため一旦送信を停止
  // useReportWebVitals((metric) => {
  //   // 送信量が多くなることが予想されるため、本番環境のみSentryへ送信する
  //   if (process.env.NEXT_PUBLIC_ENV !== 'production') {
  //     console.log(metric);
  //     return;
  //   }
  //   if (metric.rating === 'poor') {
  //     captureMessage(`Web Vitals is poor - ${metric.name}`, {
  //       level: 'info',
  //       extra: {
  //         metric,
  //       },
  //     });
  //   }
  // });

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
};

export default App;
