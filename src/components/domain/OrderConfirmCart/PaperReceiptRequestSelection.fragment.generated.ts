import gql from 'graphql-tag';
export type PaperReceiptRequestSelectionFragment = { __typename: 'PaperReceiptRequest'; needsPaperReceipt: boolean };

export const PaperReceiptRequestSelectionFragmentDoc = gql`
  fragment PaperReceiptRequestSelection on PaperReceiptRequest {
    needsPaperReceipt
  }
`;
