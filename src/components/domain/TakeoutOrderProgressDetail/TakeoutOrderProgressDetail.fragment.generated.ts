import gql from 'graphql-tag';
export type TakeoutOrderProgressDetailPartsFragment = {
  __typename: 'Progress';
  currentStep: number;
  lastStep: number;
  stepSubject: string;
  scheduledTime: string;
  tel: string;
  prepared: boolean;
  caution: string;
};

export const TakeoutOrderProgressDetailPartsFragmentDoc = gql`
  fragment TakeoutOrderProgressDetailParts on Progress {
    currentStep
    lastStep
    stepSubject
    scheduledTime
    tel
    prepared
    caution
  }
`;
