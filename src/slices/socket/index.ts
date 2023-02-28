import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JsonType, OrderType, OrdersType } from '@/types';

export type SocketState = {
  lastIncomingMessage: JsonType | OrderType | OrdersType | null;
  lastOutgoingMessage: JsonType | OrderType | OrdersType | null;
  error: string;
  ready: boolean;
};

export const initialState: SocketState = {
  lastIncomingMessage: null,
  lastOutgoingMessage: null,
  error: '',
  ready: false,
};

export const { actions, reducer } = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    changeReady: (state, action: PayloadAction<boolean>): void => {
      state.ready = action.payload;
    },
    receive: (state, action: PayloadAction<JsonType | OrderType | OrdersType>): void => {
      state.lastIncomingMessage = action.payload;
    },
    send: (state, action: PayloadAction<JsonType>): void => {
      state.lastOutgoingMessage = action.payload;
    },
    setError: (state, action: PayloadAction<string>): void => {
      debugger;
      state.error = action.payload;
    },
  },
});

export default reducer;
