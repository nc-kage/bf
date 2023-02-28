import { take, put, call, all, select, delay } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';

import config from '@config';
import { getConnection } from '@/network/socketConnection';
import { Exception, JsonType } from '@/types';
import { actions } from '@/slices/socket';
import { checkReady } from '@/slices/socket/selectors';

const URL = [
  `${config.network.socket.protocol}://${config.network.socket.host}`,
  config.network.socket.path,
].join('/');

const createChannel = (socket: WebSocket): EventChannel<() => () => void> => {
  return eventChannel((emit): () => void => {
    const messageHandler = (event: MessageEvent): void => {
      const { data } = event;
      try {
        const action = JSON.parse(data);
        emit(action);
      } catch (error) {
        throw new Error(Exception.INVALID_JSON);
      }
    };
    const closeHandler = (): void => {
      throw new Error(Exception.CONNECTION_CLOSED);
    };
    socket.addEventListener('message', messageHandler);
    socket.addEventListener('close', closeHandler);
    return () => {
      socket.removeEventListener('message', messageHandler);
      socket.removeEventListener('close', closeHandler);
      if (!socket.CLOSED) socket.close();
    };
  });
};

function* watchReceive(socket: WebSocket): Generator {
  try {
    const socketChannel = (yield call(createChannel, socket)) as ReturnType<typeof createChannel>;
    while (true) {
      const incommingMessage = (yield take(socketChannel)) as JsonType;
      yield put(actions.receive(incommingMessage));
    }
  } catch (error) {
    if ((error as Error).message === Exception.CONNECTION_CLOSED) {
      throw new Error(Exception.CONNECTION_CLOSED);
    }
    yield put(actions.setError((error as Error).message));
  }
}

function* watchSend(socket: WebSocket): Generator {
  while (true) {
    const {
      payload: outgoingMessage,
    } = (yield take(actions.send)) as ReturnType<typeof actions.send>;
    try {
      socket.send(JSON.stringify(outgoingMessage));
    } catch (error) {
      yield put(actions.setError((error as Error).message));
    }
  }
}

export default function* watchSocket(): Generator {
  try {
    const socket = (yield call(getConnection, URL)) as WebSocket;
    yield put(actions.changeReady(true));
    yield all([
      call(watchReceive, socket),
      call(watchSend, socket),
    ]);
  } catch (error) {
    if (yield select(checkReady)) {
      yield put(actions.changeReady(false));
    } else {
      yield delay(config.network.reconnectDelay);
    }
    yield call(watchSocket);
  }
}
