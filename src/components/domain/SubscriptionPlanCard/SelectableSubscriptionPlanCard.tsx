import { Box } from '@chakra-ui/react';

import { SelectableSubscriptionPlanCardFragment } from './SelectableSubscriptionPlanCard.fragment.generated';

import { SubscriptionPlanCard } from '.';

type Props = {
  plan: SelectableSubscriptionPlanCardFragment;
  onClick: (planId: string) => void;
  selected: boolean;
};

export const SelectableSubscriptionPlanCard = ({ plan, onClick, selected }: Props) => {
  const handleClick = () => {
    onClick(plan.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onClick(plan.id);
    }
  };

  return (
    <Box
      role="radio"
      aria-label={plan.title}
      aria-checked={selected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      borderRadius="12px"
    >
      <SubscriptionPlanCard plan={plan} variant={selected ? 'reverse' : 'default'} />
    </Box>
  );
};
