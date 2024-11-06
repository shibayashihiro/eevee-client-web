import React from 'react';
import renderer from 'react-test-renderer';
import { ChakraProvider } from '@chakra-ui/react';

import { OwnerCommentPartsFragment } from './OwnerComment.fragment.generated';

import { OwnerComment } from '.';

const mockOwnerIcon = '/public/test/owner-icon.png';

const generateOwnerCommentMock = ({
  ownerIcon,
  ownerName,
  comment,
}: {
  ownerIcon: string;
  ownerName?: string;
  comment: string;
}): OwnerCommentPartsFragment => ({
  __typename: 'OwnerComment',
  owner: {
    __typename: 'Owner',
    name: ownerName,
    icon: ownerIcon,
  },
  comment,
});
const toJSON = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  return result as renderer.ReactTestRendererJSON;
};

describe('render OwnerComment', () => {
  test('show owner name', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
      ownerName: 'Yamada Taro',
    });
    const component = renderer.create(
      <ChakraProvider>
        <OwnerComment ownerComment={ownerComment} showNameLabel />
      </ChakraProvider>,
    );
    const tree = toJSON(component);
    expect(tree).toMatchSnapshot();
  });
  test('hide owner name', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
      ownerName: 'Yamada Taro',
    });
    const component = renderer.create(
      <ChakraProvider>
        <OwnerComment ownerComment={ownerComment} />
      </ChakraProvider>,
    );
    const tree = toJSON(component);
    expect(tree).toMatchSnapshot();
  });
  test('OwnerName is nothing', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
    });
    const component = renderer.create(
      <ChakraProvider>
        <OwnerComment ownerComment={ownerComment} showNameLabel />
      </ChakraProvider>,
    );
    const tree = toJSON(component);
    expect(tree).toMatchSnapshot();
  });
});
