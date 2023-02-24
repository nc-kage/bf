import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { OrderProposition } from '@/types';
import { OrdersState, OrderStateType, ordersAdapter } from '.';

const { selectIds, selectById } = ordersAdapter.getSelectors();

export const getSymbol = (state: RootState): OrdersState['symbol'] => state.orders.symbol;

export const getChanId = (state: RootState): OrdersState['chanId'] => state.orders.chanId;

export const checkEmpty = (state: RootState): boolean => selectIds(state).length === 0;

const getBidPrices = createSelector<[typeof selectIds], OrderStateType['price'][]>(
  [selectIds],
  (prices) => {
    return prices.filter((price): boolean => price > 0) as OrderStateType['price'][];
  },
);

const getAskPrices = createSelector<[typeof selectIds], OrderStateType['price'][]>(
  [selectIds],
  (prices) => {
    return (prices as OrderStateType['price'][])
      .filter((price): boolean => price < 0)
      .map((price) => Math.abs(price))
      .reverse();
  },
);

export const getBid = createSelector(
  [selectById],
  (order): OrderStateType | null => {
    return order ? {
      ...order,
      proposition: OrderProposition.BID,
    } : null;
  },
);

export const getAsk = createSelector(
  [(state, price): OrderStateType | undefined => selectById(state, -price)],
  (order): OrderStateType | null => {
    return order ? {
      ...order,
      amount: Math.abs(order.amount),
      price: Math.abs(order.price),
      proposition: OrderProposition.ASK,
    } : null;
  },
);

export const getOrderPrices = (
  state: RootState, proposition: OrderProposition,
): OrderStateType['price'][] => {
  return proposition === OrderProposition.BID
    ? getBidPrices(state.orders) : getAskPrices(state.orders);
};

export const getOrder = (
  state: RootState, price: OrderStateType['price'], proposition: OrderProposition,
): OrderStateType | null => {
  return proposition === OrderProposition.BID
    ? getBid(state.orders, price) : getAsk(state.orders, price);
};
