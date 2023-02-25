import { OrderProposition } from '@/types';
import * as selectors from './selectors';

describe('orders selectors', () => {
  it('should return symbol', () => {
    const state = {
      orders: {
        symbol: 'tBTCUSD',
      },
    };
    const result = selectors.getSymbol(state);
    expect(result).toEqual('tBTCUSD');
  });
  it('should return chanId', () => {
    const state = {
      orders: {
        chanId: 1,
      },
    };
    const result = selectors.getChanId(state);
    expect(result).toEqual(1);
  });
  it('should return empty', () => {
    const state = {
      orders: {
        ids: [],
        entities: {},
      },
    };
    const result = selectors.checkEmpty(state);
    expect(result).toBeTruthy();
  });
  it('should return not empty', () => {
    const state = {
      orders: {
        ids: ['1'],
        entities: {
          1: { price: 1, amount: 1, count: 1 },
        },
      },
    };
    const result = selectors.checkEmpty(state);
    expect(result).toBeFalsy();
  });
  it('should return bid orders', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.BID);
    expect(result).toEqual([2, 1]);
  });
  it('should return ask orders', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.ASK);
    expect(result).toEqual([4, 3]);
  });
  it('should memorize returned bid orders', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.BID);
    expect(result).toBe(selectors.getOrderPrices(state, OrderProposition.BID));
  });
  it('should memorize returned ask orders', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.ASK);
    expect(result).toBe(selectors.getOrderPrices(state, OrderProposition.ASK));
  });
  it('should return empty bid orders list', () => {
    const state = {
      orders: {
        ids: ['-3', '-4'],
        entities: {
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.BID);
    expect(result).toEqual([]);
  });
  it('should return empty ask orders list', () => {
    const state = {
      orders: {
        ids: ['2', '1'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
        },
      },
    };
    const result = selectors.getOrderPrices(state, OrderProposition.ASK);
    expect(result).toEqual([]);
  });
  it('should return bid order', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrder(state, 2, OrderProposition.BID);
    expect(result).toEqual({ amount: 2, count: 2, price: 2, proposition: 1 });
  });
  it('should memorize returned bid order', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrder(state, 2, OrderProposition.BID);
    expect(result).toEqual(selectors.getOrder(state, 2, OrderProposition.BID));
  });
  it('should return ask order', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrder(state, 3, OrderProposition.ASK);
    expect(result).toEqual({ amount: 1, count: -1, price: 3, proposition: -1 });
  });
  it('should memorize returned ask order', () => {
    const state = {
      orders: {
        ids: ['2', '1', '-3', '-4'],
        entities: {
          2: { price: 2, amount: 2, count: 2 },
          1: { price: 1, amount: 1, count: 1 },
          '-3': { price: -3, amount: -1, count: -1 },
          '-4': { price: -4, amount: -2, count: -2 },
        },
      },
    };
    const result = selectors.getOrder(state, 3, OrderProposition.ASK);
    expect(result).toEqual(selectors.getOrder(state, 3, OrderProposition.ASK));
  });
});
