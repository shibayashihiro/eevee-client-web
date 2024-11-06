import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type DeliveryOrderProgressDetailPartsFragment = {
  __typename: 'Progress';
  currentStep: number;
  lastStep: number;
  stepSubject: string;
  scheduledTime: string;
  contactType: Types.ContactType;
  tel: string;
  waypointId?: string | null;
  driver?: { __typename: 'Driver'; name: string; selfIntroduction: string; image: string } | null;
};

export const DeliveryOrderProgressDetailPartsFragmentDoc = gql`
  fragment DeliveryOrderProgressDetailParts on Progress {
    currentStep
    lastStep
    stepSubject
    scheduledTime
    contactType
    tel
    driver {
      name
      selfIntroduction
      image
    }
    waypointId
  }
`;
