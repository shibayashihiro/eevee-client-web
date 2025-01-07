import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UserProfileForm } from '@/components/domain/UserProfileForm';

import {
  GetUserProfileInputFieldsQuery,
  useGetUserProfileInputFieldsQuery,
} from './SignUpStepInputUserProfile.query.generated';
import { useStepperDispatch } from './StepperProvider';

export const SignUpStepInputUserProfile = () => {
  const [{ data, error, fetching }] = useGetUserProfileInputFieldsQuery();

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data || data.tenant.userProfileInputFields.length == 0) {
    throw new Error('data not found');
  }

  return <SignUpStepInputUserProfileLayout data={data} />;
};

export const SignUpStepInputUserProfileLayout = ({ data }: { data: GetUserProfileInputFieldsQuery }) => {
  const { goToCompleted } = useStepperDispatch();
  return <UserProfileForm tenant={data.tenant} onSubmitted={goToCompleted} onClickSetupLater={goToCompleted} />;
};
