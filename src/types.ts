export type OrderType = [number, [number, number, number]];
export type OrdersType = [number, [number, number, number][]];

export type JsonType<P = null | string | number | boolean> = {
  [key: string]: P | JsonType<P> | JsonType<P>[];
};

export enum OrderSymbol {
  BTCUSD = 'tBTCUSD',
  ETHUSD = 'tETHUSD',
}

export enum OrderProposition {
  BID = 1,
  ASK = -1,
}

export enum MessageEvent {
  SUBSCRIBE = 'subscribe',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBE = 'unsubscribe',
  UNSUBSCRIBED = 'unsubscribed',
}

export enum Channel {
  BOOK = 'book',
}
