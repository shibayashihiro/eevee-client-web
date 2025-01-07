import { render, screen } from '@testing-library/react';
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

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('OwnerComment', () => {
  test('shows owner name when showNameLabel is true', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
      ownerName: 'Yamada Taro',
    });

    const { container } = renderWithChakra(<OwnerComment ownerComment={ownerComment} showNameLabel />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Yamada Taro')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('hides owner name when showNameLabel is false', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
      ownerName: 'Yamada Taro',
    });

    const { container } = renderWithChakra(<OwnerComment ownerComment={ownerComment} />);

    expect(container).toMatchSnapshot();
    expect(screen.queryByText('Yamada Taro')).not.toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('renders correctly when ownerName is not provided', () => {
    const ownerComment = generateOwnerCommentMock({
      ownerIcon: mockOwnerIcon,
      comment: 'Hello World',
    });

    const { container } = renderWithChakra(<OwnerComment ownerComment={ownerComment} showNameLabel />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
