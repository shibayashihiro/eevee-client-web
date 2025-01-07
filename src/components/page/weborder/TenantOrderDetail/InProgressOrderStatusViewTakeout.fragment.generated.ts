import gql from 'graphql-tag';
export type InProgressOrderStatusViewTakeoutFragment = {
  __typename: 'TakeoutOrder';
  id: string;
  shortIds: Array<string>;
  progress?: { __typename: 'Progress'; scheduledTime: string; prepared: boolean } | null;
  facility: {
    __typename: 'Facility';
    name: string;
    shortName: string;
    phoneNumber: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export const InProgressOrderStatusViewTakeoutFragmentDoc = gql`
  fragment InProgressOrderStatusViewTakeout on TakeoutOrder {
    id
    shortIds
    progress {
      scheduledTime
      prepared
    }
    facility {
      name
      shortName
      latLng {
        latitude
        longitude
      }
      phoneNumber
    }
  }
`;
