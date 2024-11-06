import React from 'react';
import renderer from 'react-test-renderer';

import { BalloonToLeft } from '.';

const toJSON = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  expect(result).not.toBeInstanceOf(Array);
  return result as renderer.ReactTestRendererJSON;
};

test('render BalloonToLeft', () => {
  const component = renderer.create(
    <BalloonToLeft>
      <></>
    </BalloonToLeft>,
  );
  const tree = toJSON(component);
  expect(tree).toMatchSnapshot();
});
