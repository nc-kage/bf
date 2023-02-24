export const getConnection = async (url: string): Promise<WebSocket> => {
  const socket = new WebSocket(url);
  return new Promise((resolve, reject) => {
    socket.onopen = (): void => {
      resolve(socket);
    };
    socket.onerror = (error): void => {
      reject(error);
    };
  });
};
