import { OrdersType, JsonType } from '@/types';

const checkOrderData = (data: unknown): boolean => {
  return Array.isArray(data) && data.length === 3 && data.every((item) => typeof item === 'number');
};

export const getMessageOrders = (message: JsonType): OrdersType | undefined => {
  const chainId = message[0];
  if (!chainId) return undefined;
  const data = message[1];
  if (checkOrderData(data as [number, number, number])) {
    return [chainId as number, [data as [number, number, number]]];
  }
  if (Array.isArray(data) && (data as unknown[]).every((item) => checkOrderData(item))) {
    return [chainId as number, data as unknown as [number, number, number][]];
  }
  return undefined;
};
