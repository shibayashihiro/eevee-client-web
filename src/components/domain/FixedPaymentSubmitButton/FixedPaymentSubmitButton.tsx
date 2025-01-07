import { PrimaryButton } from '@/components/ui/Button';

type Props = {
  onSubmit: () => Promise<void>;
  disabled: boolean;
};

export const FixedPaymentSubmitButton = ({ onSubmit, disabled }: Props) => {
  return (
    <PrimaryButton h="56px" onClick={onSubmit} isDisabled={disabled}>
      お会計を確定する
    </PrimaryButton>
  );
};
