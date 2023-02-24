import { take, put, call, all } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';

import config from '@config';
import { getConnection } from '@/network/socketConnection';
import { JsonType } from '@/types';
import { actions } from '@/slices/socket';

const URL = [
  `${config.network.socket.protocol}://${config.network.socket.host}`,
  config.network.socket.path,
].join('/');

const createChannel = (socket: WebSocket): EventChannel<() => () => void> => {
  return eventChannel((emit): () => void => {
    const messageHandler = (event: MessageEvent): void => {
      const { data } = event;
      const action = JSON.parse(data);
      emit(action);
    };
    socket.addEventListener('message', messageHandler);
    return () => {
      socket.removeEventListener('message', messageHandler);
      socket.close();
    };
  });
};

function* watchReceive(socket: WebSocket): Generator {
  const socketChannel = (yield call(createChannel, socket)) as ReturnType<typeof createChannel>;
  while (true) {
    try {
      const incommingMessage = (yield take(socketChannel)) as JsonType;
      yield put(actions.receive(incommingMessage));
    } catch (error) {
      yield put(actions.setError((error as Error).message));
    }
  }
}

function* watchSend(socket: WebSocket): Generator {
  while (true) {
    const {
      payload: outgoingMessage,
    } = (yield take(actions.send)) as ReturnType<typeof actions.send>;
    socket.send(JSON.stringify(outgoingMessage));
  }
}

export default function* watchSocket(): Generator {
  const socket = (yield call(getConnection, URL)) as WebSocket;
  yield put(actions.changeReady(true));
  yield all([
    call(watchReceive, socket),
    call(watchSend, socket),
  ]);
}
