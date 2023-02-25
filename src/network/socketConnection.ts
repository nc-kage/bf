import config from '@config';
import { Exception } from '@/types';

export const getConnection = async (url: string): Promise<WebSocket> => {
  const socket = new WebSocket(url);
  return Promise.race([
    new Promise((resolve, reject) => {
      socket.onopen = (): void => {
        resolve(socket);
      };
      socket.onerror = (): void => {
        reject(new Error(Exception.CONNECTION_CLOSED));
      };
    }),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(Exception.TIMEOUT));
      }, config.network.connectTimeout);
    }),
  ]) as Promise<WebSocket>;
};
