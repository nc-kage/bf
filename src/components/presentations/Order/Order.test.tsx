import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Comp from '.';

describe('App', () => {
  it('snapshot left', () => {
    const { asFragment } = render(
      <Comp
        className="test"
        order={{ price: 1, amount: 1, count: 1 }}
        orientation="left"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot right', () => {
    const { asFragment } = render(
      <Comp
        className="test"
        order={{ price: 1, amount: 1, count: 1 }}
        orientation="right"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
