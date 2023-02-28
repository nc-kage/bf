/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { getConnection } from './socketConnection';

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

describe('socketConnection', () => {
  it('should return connection', async () => {
    global.WebSocket = class WS {
      constructor() {
        setTimeout(() => {
          this.onopen();
        }, 0);
      }

      public onopen(): void {
        // do nothing
      }
    } as unknown as typeof WebSocket;
    const connection = await getConnection('ws://localhost');
    expect(connection).toBeInstanceOf(global.WebSocket);
  });

  it('should throw connection close error', async () => {
    global.WebSocket = class WS {
      constructor() {
        setTimeout(() => {
          this.onerror();
        }, 0);
      }

      public onerror(): void {
        // do nothing
      }
    } as unknown as typeof WebSocket;
    try {
      await getConnection('ws://localhost');
    } catch (error) {
      expect((error as Error).message).toBe('Connection closed');
    }
  });

  it('should throw timeout error', async () => {
    global.WebSocket = class WS {
      constructor() {
        setTimeout(() => {
          this.onopen();
        }, 300);
      }

      public onopen(): void {
        // do nothing
      }
    } as unknown as typeof WebSocket;
    try {
      await getConnection('ws://localhost');
    } catch (error) {
      expect((error as Error).message).toBe('Timeout');
    }
  });
});
