import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Comp from '.';
import { OrderSymbol } from '@/types';

jest.mock('@/components/containers/Orders', () => (): null => null);

describe('App', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <Comp
        symbols={[OrderSymbol.BTCUSD, OrderSymbol.ETHUSD]}
        selectedSymbol={OrderSymbol.BTCUSD}
        onSelectSymbol={jest.fn()}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
