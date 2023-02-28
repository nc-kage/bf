import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import * as rr from 'react-redux';
import '@testing-library/jest-dom';

import Comp from '.';

jest.mock('@/components/containers/Orders', () => (): null => null);
jest.mock('react-redux', () => {
  let state = {
    socket: {
      ready: true,
    },
    orders: {
      symbol: 'tBTCUSD',
    },
  };
  const useSelector = (selector: (s: unknown) => unknown): unknown => {
    return selector(state);
  };

  let mock = jest.fn();

  const useDispatch = (): jest.Mock => mock;

  const setState = (s: typeof state): void => {
    state = s;
  };

  const setMock = (m: jest.Mock): void => {
    mock = m;
  };

  return { useSelector, useDispatch, setState, setMock };
});

describe('App', () => {
  it('should dispatch setSymbol on change symbol', () => {
    const { getByTestId } = render(
      <Comp />,
    );
    const dispatch = rr.useDispatch();
    const select = getByTestId('select-symbol');
    expect(select).toHaveValue('tBTCUSD');
    fireEvent.change(select, { target: { value: 1 } });
    expect(dispatch).toBeCalledTimes(2);
  });
});
