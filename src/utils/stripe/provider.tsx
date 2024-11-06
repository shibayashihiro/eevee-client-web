// eslint-disable-next-line no-restricted-imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', { locale: 'ja' });

type Props = {
  children: React.ReactNode;
};
/**
 * StripeのElementsプロバイダーをレンダリングし、子コンポーネントがStripeのコンポーネントやhooksを使用できるようにする
 */
export const StripeProvider = ({ children }: Props) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
