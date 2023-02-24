import { RootState } from '@/store';

export const checkReady = (state: RootState): boolean => state.socket.ready;
