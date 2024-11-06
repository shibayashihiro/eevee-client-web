import gql from 'graphql-tag';
export type TableNumberMainHeaderPartsFragment = { __typename: 'Table'; name: string };

export const TableNumberMainHeaderPartsFragmentDoc = gql`
  fragment TableNumberMainHeaderParts on Table {
    name
  }
`;
