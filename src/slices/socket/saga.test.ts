import { getConnection } from '@/network/socketConnection';
import watchSocket from './saga';

jest.mock('@config', () => ({
  network: {
    reconnectDelay: 200,
    connectTimeout: 200,
    socket: {
      protocol: 'ws',
      host: 'bitfinex.com',
      path: 'ws/3',
    },
  },
}));

describe('socket saga', () => {
  it('should create connection with url from config', () => {
    const gen = watchSocket();
    let effect = gen.next();

    expect(effect.value.payload.fn).toEqual(getConnection);
    expect(effect.value.payload.args).toEqual(['ws://bitfinex.com/ws/3']);
    expect(effect.done).toBeFalsy();
    effect = gen.next(new WebSocket('ws://localhost'));
    expect(effect.value.payload.action).toEqual({
      type: 'socket/changeReady', payload: true,
    });
    expect(effect.done).toBeFalsy();
    effect = gen.next();
    expect(effect.done).toBeFalsy();
    effect = gen.next();
    expect(effect.done).toBeTruthy();
  });

  it('should change ready to false on error if ready state is true', () => {
    const gen = watchSocket();
    gen.next();
    gen.next(new WebSocket('ws://localhost'));
    let effect = gen.throw('test error');
    expect(effect.done).toBeFalsy();
    effect = gen.next(true);
    expect(effect.value.payload.action).toEqual({
      type: 'socket/changeReady', payload: false,
    });
    expect(effect.done).toBeFalsy();
    effect = gen.next();
    expect(effect.value.payload.fn).toBe(watchSocket);
    expect(effect.done).toBeFalsy();
  });

  it('should not change ready to false on error if ready state is already false', () => {
    const gen = watchSocket();
    gen.next();
    let effect = gen.throw('test error');
    expect(effect.done).toBeFalsy();
    effect = gen.next(false);
    expect(effect.value.payload.args[0]).toBe(200);
    expect(effect.done).toBeFalsy();
    effect = gen.next(false);
    expect(effect.value.payload.fn).toBe(watchSocket);
    expect(effect.done).toBeFalsy();
  });

  it('should invoke send method on dispatching send action with object', () => {
    const gen = watchSocket();
    const ws = {
      send: jest.fn(),
    };
    gen.next();
    gen.next(ws);
    let effect = gen.next();

    const watchSendGen = effect.value.payload[1].payload.fn(
      ...effect.value.payload[1].payload.args,
    );
    effect = watchSendGen.next();
    expect(effect.value.payload.pattern.type).toBe('socket/send');

    effect = watchSendGen.next({ payload: { event: 'test' } });
    expect(ws.send).toBeCalledWith('{"event":"test"}');
  });

  it('should put error action on error', () => {
    const gen = watchSocket();
    const ws = {
      send: (): void => {
        throw new Error('test error');
      },
    };
    gen.next();
    gen.next(ws);
    let effect = gen.next();

    const watchSendGen = effect.value.payload[1].payload.fn(
      ...effect.value.payload[1].payload.args,
    );
    effect = watchSendGen.next();
    expect(effect.value.payload.pattern.type).toBe('socket/send');
    effect = watchSendGen.next({ payload: { event: 'test' } });
    expect(effect.value.payload.action.type).toBe('socket/setError');
    expect(effect.value.payload.action.payload).toBe('test error');
  });

  it('should put action with message on receiving', () => {
    const gen = watchSocket();
    const ws = new WebSocket('ws://localhost');
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = (): null => null;
    expect(effect.done).toBeFalsy();
    effect = watchReceiveGen.next(channel);
    expect(effect.done).toBeFalsy();
    effect = watchReceiveGen.next({ test: 123 });
    expect(effect.value.payload.action.type).toBe('socket/receive');
    expect(effect.value.payload.action.payload).toEqual({ test: 123 });
  });

  it('should put action with error on catch not close error', () => {
    const gen = watchSocket();
    const ws = new WebSocket('ws://localhost');
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = (): null => null;
    effect = watchReceiveGen.next(channel);
    effect = watchReceiveGen.throw(new Error('test error'));
    expect(effect.value.payload.action.type).toBe('socket/setError');
    expect(effect.value.payload.action.payload).toEqual('test error');
  });

  it('should throw error on catch close error', () => {
    const gen = watchSocket();
    const ws = new WebSocket('ws://localhost');
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = (): null => null;
    effect = watchReceiveGen.next(channel);
    try {
      watchReceiveGen.throw(new Error('Connection closed'));
    } catch (e) {
      expect(e).toEqual(new Error('Connection closed'));
    }
  });

  it('should emit data of the message', () => {
    const gen = watchSocket();
    const ws = {
      callbacks: {
        message: [],
        close: [],
      },
      addEventListener(event: string, cb: never): void {
        if (['close', 'message'].includes(event)) {
          this.callbacks[event as 'message'].push(cb);
        }
      },
      removeEventListener: jest.fn(),
    };
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = effect.value.payload.fn(...effect.value.payload.args);
    const spy = (action: string): void => {
      expect(action).toEqual({ data: 'test' });
    };
    channel.take(spy);
    ws.callbacks.message.forEach((cb) => (cb as any)({ data: '{ "data": "test" }' }));
  });

  it('should throw invalid json error on incorrect message', () => {
    const gen = watchSocket();
    const ws = {
      callbacks: {
        message: [],
        close: [],
      },
      addEventListener(event: string, cb: never): void {
        if (['close', 'message'].includes(event)) {
          this.callbacks[event as 'message'].push(cb);
        }
      },
      removeEventListener: jest.fn(),
    };
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = effect.value.payload.fn(...effect.value.payload.args);
    channel.take(() => null);
    try {
      ws.callbacks.message.forEach((cb) => (cb as any)({ data: '' }));
    } catch (error) {
      expect(error).toEqual(new Error('Invalid JSON'));
    }
  });

  it('should throw close error on closing connection', () => {
    const gen = watchSocket();
    const ws = {
      callbacks: {
        message: [],
        close: [],
      },
      addEventListener(event: string, cb: never): void {
        if (['close', 'message'].includes(event)) {
          this.callbacks[event as 'message'].push(cb);
        }
      },
      removeEventListener: jest.fn(),
    };
    gen.next();
    gen.next(ws);
    let effect = gen.next();
    const watchReceiveGen = effect.value.payload[0].payload.fn(
      ...effect.value.payload[0].payload.args,
    );
    effect = watchReceiveGen.next();
    const channel = effect.value.payload.fn(...effect.value.payload.args);
    channel.take(() => null);
    try {
      ws.callbacks.close.forEach((cb) => (cb as any)());
    } catch (error) {
      expect(error).toEqual(new Error('Connection closed'));
    }
  });
});
