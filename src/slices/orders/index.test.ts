import { OrderSymbol } from '@/types';
import { reducer, actions } from '.';
import { actions as socketActions } from '@/slices/socket';

describe('orders reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 0,
      waiting: true,
      ids: [],
      entities: {},
    });
  });

  it('should handle setSymbol', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [1],
      entities: {
        1: { price: 1, amount: 1, count: 1 },
      },
    };
    expect(reducer(state, actions.setSymbol(OrderSymbol.ETHUSD))).toEqual({
      symbol: OrderSymbol.ETHUSD,
      chanId: 1,
      waiting: true,
      ids: [],
      entities: {},
    });
  });

  it('should handle setChanId', () => {
    expect(reducer(undefined, socketActions.receive({ event: 'subscribed', chanId: 1 }))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [],
      entities: {},
    });
  });

  it('should set initial orders', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [],
      entities: {},
    };
    const payload: [number, [number, number, number][]] = [1, [
      [2, 2, 2],
      [1, 1, 1],
      [3, 3, -3],
      [4, 4, -4],
    ]];
    expect(reducer(state, socketActions.receive(payload))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    });
  });

  it('should update bid order', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    };
    const payload: [number, [number, number, number]] = [1, [2, 2, 5]];
    expect(reducer(state, socketActions.receive(payload))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 5 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    });
  });

  it('should update ask order', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    };
    const payload: [number, [number, number, number]] = [1, [3, 3, -5]];
    expect(reducer(state, socketActions.receive(payload))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -5 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    });
  });

  it('should remove bid order', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    };
    const payload: [number, [number, number, number]] = [1, [2, 0, 5]];
    expect(reducer(state, socketActions.receive(payload))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [1, -3, -4],
      entities: {
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    });
  });

  it('should remove ask order', () => {
    const state = {
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -3, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-3': { price: -3, count: 3, amount: -3 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    };
    const payload: [number, [number, number, number]] = [1, [3, 0, -5]];
    expect(reducer(state, socketActions.receive(payload))).toEqual({
      symbol: OrderSymbol.BTCUSD,
      chanId: 1,
      waiting: false,
      ids: [2, 1, -4],
      entities: {
        2: { price: 2, count: 2, amount: 2 },
        1: { price: 1, count: 1, amount: 1 },
        '-4': { price: -4, count: 4, amount: -4 },
      },
    });
  });
});
