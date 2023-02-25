import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Comp from '.';
import { OrderProposition } from '@/types';

jest.mock('@/components/containers/Order', () => (): null => null);

describe('App', () => {
  it('snapshot left', () => {
    const { asFragment } = render(
      <Comp
        orderPrices={[1, 2]}
        orderPosition={OrderProposition.BID}
        orientation="left"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot right', () => {
    const { asFragment } = render(
      <Comp
        orderPrices={[1, 2]}
        orderPosition={OrderProposition.BID}
        orientation="right"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
