import { render } from '@testing-library/react';

import { BalloonToLeft } from '.';

describe('BalloonToLeft', () => {
  test('renders correctly', () => {
    const { container } = render(
      <BalloonToLeft>
        <></>
      </BalloonToLeft>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
