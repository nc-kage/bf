import { createSlice, EntityState, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';

import { JsonType, MessageEvent, OrderProposition, OrdersType, OrderSymbol } from '@/types';
import * as socket from '@/slices/socket';

export type OrderStateType = {
  price: number;
  amount: number;
  count: number;
  proposition?: OrderProposition;
};

export type OrdersState = EntityState<OrderStateType> & {
  symbol: OrderSymbol;
  chanId: number;
  waiting: boolean;
};

export const ordersAdapter = createEntityAdapter<OrderStateType>({
  selectId: (order: OrderStateType): OrderStateType['price'] => order.price,
  sortComparer: (a: OrderStateType, b: OrderStateType): number => b.price - a.price,
});

export const initialState: OrdersState = {
  ...ordersAdapter.getInitialState(),
  symbol: OrderSymbol.BTCUSD,
  chanId: 0,
  waiting: true,
};

export const blackList = ['waiting', 'chanId'];

export const { actions, reducer } = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<OrdersState['symbol']>): void => {
      if (state.symbol !== action.payload) state = ordersAdapter.removeAll(state);
      state.symbol = action.payload;
      state.waiting = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(socket.actions.receive, (state, action) => {
      const { payload } = action;
      if ((payload as JsonType)?.event === MessageEvent.SUBSCRIBED
        && (payload as JsonType)?.chanId) {
        state.waiting = false;
        state.chanId = (payload as JsonType).chanId as number;
      }
      if (payload[0] !== state.chanId || state.waiting) return;
      const isInitial = typeof (payload as OrdersType)[1][0] !== 'number';
      const orders = (isInitial
        ? payload[1] as [number, number, number][]
        : [payload[1] as [number, number, number]]).filter((item) => {
        return Array.isArray(item) && item.length === 3;
      }).map(([priceAbs, count, amount]) => {
        const price = amount > 0 ? priceAbs : -priceAbs;
        return { price, count, amount };
      });
      if (isInitial) {
        state = ordersAdapter.setAll(state, orders);
      } else {
        orders.forEach(({ price, count, amount }) => {
          if (count > 0) {
            state = ordersAdapter.upsertOne(state, { price, count, amount });
          } else {
            state = ordersAdapter.removeOne(state, price);
          }
        });
      }
    });
  },
});

export default reducer;
