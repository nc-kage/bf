import React, { ReactElement, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '@/components/presentations/App';
import { OrderSymbol } from '@/types';
import * as orders from '@/slices/orders';
import * as ordersSelectors from '@/slices/orders/selectors';
import * as socketSelectors from '@/slices/socket/selectors';

const symbols = Object.values(OrderSymbol);

const App = (): ReactElement => {
  const selectedSymbol = useSelector(ordersSelectors.getSymbol);
  const isReady = useSelector(socketSelectors.checkReady);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReady) {
      dispatch(orders.actions.setSymbol(OrderSymbol.BTCUSD));
    }
  }, [dispatch, isReady]);

  const selectHandler = useCallback((symbol: OrderSymbol): void => {
    dispatch(orders.actions.setSymbol(symbol));
  }, [dispatch]);
  return (
    <View
      onSelectSymbol={selectHandler}
      selectedSymbol={selectedSymbol}
      symbols={symbols}
    />
  );
};

export default App;
