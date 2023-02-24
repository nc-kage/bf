import { put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { actions, OrdersState } from '@/slices/orders';
import * as ordersSelectors from '@/slices/orders/selectors';
import * as socket from '@/slices/socket';
import { Channel, MessageEvent } from '@/types';

function* setSymbolSaga<S = OrdersState['symbol']>(action: PayloadAction<S>): Generator {
  const chanId = (yield select(ordersSelectors.getChanId)) as number;
  if (chanId) {
    yield put(socket.actions.send({ event: MessageEvent.UNSUBSCRIBE, chanId }));
  }
  yield put(socket.actions.send({
    event: MessageEvent.SUBSCRIBE, channel: Channel.BOOK, symbol: action.payload as string,
  }));
}

export default function* watch(): Generator {
  yield takeLatest(actions.setSymbol.type, setSymbolSaga);
}
